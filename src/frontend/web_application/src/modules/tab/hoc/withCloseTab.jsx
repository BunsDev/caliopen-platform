import React from 'react';
import TabConsumer from '../components/TabConsumer';

export const withCloseTab = () => (C) =>
  function (props) {
    return (
      <TabConsumer
        render={({ removeTab, getCurrentTab }) => {
          const closeTab = (tab) => {
            if (!tab) {
              return removeTab({ tab: getCurrentTab() });
            }

            return removeTab({ tab });
          };

          return <C closeTab={closeTab} {...props} />;
        }}
      />
    );
  };
