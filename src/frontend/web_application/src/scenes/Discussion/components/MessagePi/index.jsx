import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from '@lingui/react';
import classnames from 'classnames';
import { Icon, TextBlock } from '../../../../components';
import { getAveragePIMessage, getPiClass } from '../../../../modules/pi';
import { isMessageEncrypted } from '../../../../services/encryption';

import simpleEnvelope from './assets/simple-envelope.png';
// XXX uncomment when messages will be signed
// import sealedEnvelope from './assets/sealed-envelope.png';
import postalCard from './assets/postal-card.png';

import './style.scss';

@withI18n()
class MessagePi extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({ _: PropTypes.func }).isRequired,
    message: PropTypes.shape({}).isRequired,
    illustrate: PropTypes.bool,
    describe: PropTypes.bool,
  };

  static defaultProps = {
    illustrate: false,
    describe: false,
  };

  static getIndexIconType = (aspect) => {
    switch (true) {
      case Number.isNaN(aspect):
        return 'question';
      case aspect <= 33:
        return 'times';
      case aspect <= 66:
        return 'warning';
      default:
        return 'check';
    }
  };

  renderIllustrationImg = () => {
    const { message, i18n } = this.props;

    if (isMessageEncrypted(message)) {
      return (
        <img
          src={simpleEnvelope}
          alt={i18n._(/* i18n */ 'message.img.simple-envelope', null, {
            message: 'This message is like a sealed envelop',
          })}
        />
      );
    }

    return (
      <img
        src={postalCard}
        alt={i18n._(/* i18n */ 'message.img.postal-card', null, {
          message: 'This message is like a postal card',
        })}
      />
    );
  };

  renderIllustration() {
    const { message } = this.props;

    return (
      <div className="m-message-pi__illustration">
        {this.renderIllustrationImg()}
        <ul className="m-message-pi__types">
          <li className={getPiClass(message.pi_message.social)}>
            <TextBlock inline>
              <Icon
                type={this.constructor.getIndexIconType(
                  message.pi_message.social
                )}
              />
              <Trans id="message.pi.comportment" message="Sender" />
            </TextBlock>
          </li>
          <li className={getPiClass(message.pi_message.content)}>
            <TextBlock inline>
              <Icon
                type={this.constructor.getIndexIconType(
                  message.pi_message.content
                )}
              />
              <Trans id="message.pi.context" message="Departure" />
            </TextBlock>
          </li>
          <li className={getPiClass(message.pi_message.transport)}>
            <TextBlock inline>
              <Icon
                type={this.constructor.getIndexIconType(
                  message.pi_message.transport
                )}
              />
              <Trans id="message.pi.technic" message="Travel" />
            </TextBlock>
          </li>
        </ul>
      </div>
    );
  }

  renderDescription = () => {
    const { message } = this.props;

    return (
      <p className="m-message-pi__metaphor">
        {isMessageEncrypted(message) ? (
          <Trans
            id="message.pi.description.metaphor.encrypted"
            message="In real life this message would be somewhat equivalent to letter within an envelope."
          />
        ) : (
          <Trans
            id="message.pi.description.metaphor.unencrypted"
            message="In real life this message would be somewhat equivalent to a postal card visible by everyone."
          />
        )}
      </p>
    );
  };

  render() {
    const { illustrate, describe, message } = this.props;

    if (!message.pi_message) {
      return null;
    }

    const piAggregate = getAveragePIMessage({ message });
    const piClass = getPiClass(piAggregate);
    const piValue = Number.isFinite(piAggregate)
      ? Math.round(piAggregate)
      : '?';
    const progressMeterStyle = piAggregate
      ? {
          width: `${piAggregate}%`,
        }
      : {};

    return (
      <div className="m-message-pi">
        {illustrate ? this.renderIllustration() : null}
        <div
          className={classnames('m-message-pi__meter', {
            'm-message-pi__meter--no-separator': !describe,
          })}
        >
          <div
            className={classnames([
              'm-message-pi__progress',
              `m-message-pi__progress--${piClass}`,
            ])}
            role="progressbar"
            aria-valuenow={piAggregate}
            aria-valuemax="100"
            tabIndex="0"
          >
            <div
              className={classnames(
                'm-message-pi__progress-meter',
                `m-message-pi__progress-meter--${piClass}`
              )}
              style={progressMeterStyle}
            />
          </div>
          <div className="m-message-pi__numeric">
            <span className="m-message-pi__numeric-legend">
              <Trans id="message.pi.label" message="Privacy index:" />
            </span>
            <span className="m-message-pi__numeric-value">{piValue}</span>
          </div>
        </div>
        {describe && this.renderDescription()}
      </div>
    );
  }
}

export default MessagePi;
