package twitterworker

import (
	"errors"
	broker "github.com/CaliOpen/Caliopen/src/backend/brokers/go.twitter"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/index/elasticsearch"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.backends/store/cassandra"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main/facilities/Notifications"
	log "github.com/Sirupsen/logrus"
	"github.com/gocql/gocql"
	"github.com/nats-io/go-nats"
	"sync"
	"time"
)

type (
	Worker struct {
		AccountHandlers map[string]*AccountHandler // one worker per active Twitter account
		HaltGroup       *sync.WaitGroup
		Index           backends.LDAIndex
		Id              uint8
		NatsConn        *nats.Conn
		NatsSubs        []*nats.Subscription
		Notifier        *Notifications.Notifier
		Store           backends.LDAStore
		WorkersGuard    *sync.RWMutex
		Conf            WorkerConfig
	}

	WorkerConfig struct {
		Workers          uint8               `mapstructure:"workers"`
		TwitterAppKey    string              `mapstructure:"twitter_app_key"`
		TwitterAppSecret string              `mapstructure:"twitter_app_secret"`
		BrokerConfig     broker.BrokerConfig `mapstructure:"BrokerConfig"`
	}
)

const (
	failuresThreshold = 72 // how many hours to wait before disabling a faulty remote.
	noPendingJobErr   = "no pending job"
	pollThrottling    = 30 * time.Second
)

func InitWorker(conf WorkerConfig, verboseLog bool, id uint8) (worker *Worker, err error) {

	if verboseLog {
		log.SetLevel(log.DebugLevel)
	}

	worker = &Worker{
		AccountHandlers: map[string]*AccountHandler{},
		Conf:            conf,
		Id:              id,
		WorkersGuard:    new(sync.RWMutex),
	}

	// init Store
	switch conf.BrokerConfig.StoreName {
	case "cassandra":
		c := store.CassandraConfig{
			Hosts:       conf.BrokerConfig.StoreConfig.Hosts,
			Keyspace:    conf.BrokerConfig.StoreConfig.Keyspace,
			Consistency: gocql.Consistency(conf.BrokerConfig.StoreConfig.Consistency),
			SizeLimit:   conf.BrokerConfig.StoreConfig.SizeLimit,
			UseVault:    conf.BrokerConfig.StoreConfig.UseVault,
		}
		if conf.BrokerConfig.StoreConfig.ObjectStore == "s3" {
			c.WithObjStore = true
			c.Endpoint = conf.BrokerConfig.StoreConfig.OSSConfig.Endpoint
			c.AccessKey = conf.BrokerConfig.StoreConfig.OSSConfig.AccessKey
			c.SecretKey = conf.BrokerConfig.StoreConfig.OSSConfig.SecretKey
			c.RawMsgBucket = conf.BrokerConfig.StoreConfig.OSSConfig.Buckets["raw_messages"]
			c.AttachmentBucket = conf.BrokerConfig.StoreConfig.OSSConfig.Buckets["temporary_attachments"]
			c.Location = conf.BrokerConfig.StoreConfig.OSSConfig.Location
		}
		if conf.BrokerConfig.StoreConfig.UseVault {
			c.HVaultConfig.Url = conf.BrokerConfig.StoreConfig.VaultConfig.Url
			c.HVaultConfig.Username = conf.BrokerConfig.StoreConfig.VaultConfig.Username
			c.HVaultConfig.Password = conf.BrokerConfig.StoreConfig.VaultConfig.Password
		}
		b, e := store.InitializeCassandraBackend(c)
		if e != nil {
			err = e
			log.WithError(err).Warnf("[TwitterWorker] initialization of %s backend failed", conf.BrokerConfig.StoreName)
			return
		}

		worker.Store = backends.LDAStore(b) // type conversion to LDA interface
	default:
		log.Warnf("[TwitterWorker] unknown store backend: %s", conf.BrokerConfig.StoreName)
		err = errors.New("[TwitterWorker] unknown store backend")
		return

	}

	// init Index
	switch conf.BrokerConfig.LDAConfig.IndexName {
	case "elasticsearch":
		c := index.ElasticSearchConfig{
			Urls: conf.BrokerConfig.LDAConfig.IndexConfig.Urls,
		}
		i, e := index.InitializeElasticSearchIndex(c)
		if e != nil {
			err = e
			log.WithError(err).Warnf("[TwitterBroker] initialization of %s backend failed", conf.BrokerConfig.IndexName)
			return
		}

		worker.Index = backends.LDAIndex(i) // type conversion to LDA interface
	default:
		log.Warnf("[TwitterBroker] unknown index backend: %s", conf.BrokerConfig.LDAConfig.IndexName)
		err = errors.New("[TwitterBroker] unknown index backend")
		return
	}

	worker.NatsConn, err = nats.Connect(conf.BrokerConfig.NatsURL)
	if err != nil {
		log.WithError(err).Warn("[TwitterBroker] initalization of NATS connexion failed")
		return
	}
	caliopenConfig := CaliopenConfig{
		NotifierConfig: conf.BrokerConfig.LDAConfig.NotifierConfig,
		NatsConfig: NatsConfig{
			Url: conf.BrokerConfig.NatsURL,
		},
		RESTstoreConfig: RESTstoreConfig{
			BackendName:  conf.BrokerConfig.StoreName,
			Consistency:  conf.BrokerConfig.StoreConfig.Consistency,
			Hosts:        conf.BrokerConfig.StoreConfig.Hosts,
			Keyspace:     conf.BrokerConfig.StoreConfig.Keyspace,
			OSSConfig:    conf.BrokerConfig.StoreConfig.OSSConfig,
			ObjStoreType: conf.BrokerConfig.StoreConfig.ObjectStore,
			SizeLimit:    conf.BrokerConfig.StoreConfig.SizeLimit,
		},
		RESTindexConfig: RESTIndexConfig{
			Hosts:     conf.BrokerConfig.LDAConfig.IndexConfig.Urls,
			IndexName: conf.BrokerConfig.LDAConfig.IndexName,
		},
	}
	worker.Notifier = Notifications.NewNotificationsFacility(caliopenConfig, worker.NatsConn)

	// init Nats connector
	worker.NatsConn, err = nats.Connect(conf.BrokerConfig.NatsURL)
	if err != nil {
		log.WithError(err).Fatal("[TwitterWorker] initialization of NATS connexion failed")
	}
	worker.NatsSubs = make([]*nats.Subscription, 1)
	worker.NatsSubs[0], err = worker.NatsConn.QueueSubscribe(conf.BrokerConfig.NatsTopicDMs, conf.BrokerConfig.NatsQueue, worker.DMmsgHandler)
	if err != nil {
		log.WithError(err).Fatal("[TwitterWorker] initialization of NATS fetcher subscription failed")
	}
	err = worker.NatsConn.Flush()
	if err != nil {
		log.WithError(err).Fatal("[TwitterWorker] initialization of NATS fetcher subscription failed")
	}

	return worker, nil
}

func (worker *Worker) Start() {
	log.Infof("Twitter worker %d started", worker.Id)

	// start throttled jobs polling
	for {
		start := time.Now()
		requestOrder := []byte(`{"worker":"twitter","order":"need_job"}`)
		log.Infof("Twitter worker %d is requesting jobs to idpoller", worker.Id)
		resp, err := worker.NatsConn.Request(worker.Conf.BrokerConfig.NatsTopicPoller, requestOrder, 30*time.Second)
		if err != nil {
			log.WithError(err).Warnf("[worker %d] failed to request pending jobs on nats", worker.Id)
		} else {
			worker.WorkerMsgHandler(resp)
		}
		// check for interrupt after job is finished
		if worker.HaltGroup != nil {
			worker.Stop()
			break
		}
		elapsed := time.Now().Sub(start)
		if elapsed < pollThrottling {
			time.Sleep(pollThrottling - elapsed)
		}
	}
}

func (worker *Worker) Stop() {
	for _, w := range worker.AccountHandlers {
		w.WorkerDesk <- Stop
	}
	for _, sub := range worker.NatsSubs {
		sub.Unsubscribe()
	}
	worker.NatsConn.Close()
	worker.Store.Close()
	worker.Index.Close()
	worker.HaltGroup.Done()
	log.Infof("worker %d stopped", worker.Id)
}

// getOrCreateWorker returns a pointer to a worker already in cache
// or tries to create a new worker for the remote identity if not.
// returns nil if get or create failed.
func (w *Worker) getOrCreateWorker(userId, remoteId string) *AccountHandler {
	if accountWorker, ok := w.AccountHandlers[userId+remoteId]; ok {
		return accountWorker
	} else {
		log.Infof("[getOrCreateWorker] failed to retrieve registered worker for remote %s (user %s). Trying to add one.", remoteId, userId)
		if userId == "" || remoteId == "" {
			return nil
		}
		accountWorker, err := NewAccountHandler(userId, remoteId, *w)
		if err != nil {
			log.WithError(err).Warnf("[getOrCreateWorker] failed to create new worker for remote %s (user %s)", remoteId, userId)
			return nil
		}
		w.RegisterWorker(accountWorker)
		go accountWorker.Start()
		return accountWorker

	}
}

func (w *Worker) RegisterWorker(accountWorker *AccountHandler) {
	workerKey := accountWorker.userAccount.userID.String() + accountWorker.userAccount.remoteID.String()
	// do not register same broker twice
	if registeredWorker, ok := w.AccountHandlers[workerKey]; ok {
		w.RemoveAccountHandler(registeredWorker)
	}
	w.WorkersGuard.Lock()
	w.AccountHandlers[workerKey] = accountWorker
	w.WorkersGuard.Unlock()
}

func (w *Worker) RemoveAccountHandler(accountWorker *AccountHandler) {
	workerKey := accountWorker.userAccount.userID.String() + accountWorker.userAccount.remoteID.String()
	w.WorkersGuard.Lock()
	accountWorker.Stop()
	delete(w.AccountHandlers, workerKey)
	w.WorkersGuard.Unlock()
}
