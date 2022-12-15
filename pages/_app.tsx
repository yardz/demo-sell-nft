import Layout from '@components/Layout';
import Web3ProviderNetwork from '@components/Web3ProviderNetwork';
import { GlobalProvider } from '@provider/GlobalContext';
import store, { persistor } from '@store/index';
import getLibrary from '@utils/functions/getLibrary';
import { Web3ReactProvider } from '@web3-react/core';
import { NextComponentType, NextPageContext } from 'next';
import { AppProps } from 'next/app';
import Script from 'next/script';
import React, { Fragment, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import ApplicationUpdater from '@store/application/updater';
import Web3ReactManager from '@components/Web3ReactManager';

import { OreId } from 'oreid-js';
import { OreidProvider } from 'oreid-react';
import { WebPopup } from 'oreid-webpopup';

const oreId = new OreId({
  appId: 't_b08a78e045e34a0482821cb1346dbcba',
  plugins: { popup: WebPopup() }
});

function App({
  Component,
  pageProps
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Layout: FunctionComponent;
    Provider: FunctionComponent;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [beforeHistoryFromSignCallback] = useState(false);

  const Provider = Component.Provider || Fragment;

  return (
    <Fragment>
      <>
        <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" />
        <Script
          src="https://unpkg.com/@rfoxlabs/rfox-nft-webcomponents/dist/components/components.esm.js"
          type="module"
        />
      </>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <ReduxProvider store={store}>
            <PersistGate loading={<div>loading</div>} persistor={persistor}>
              {() => (
                <>
                  <ApplicationUpdater />
                  <GlobalProvider>
                    <OreidProvider oreId={oreId}>
                      <Provider>
                        {loading && !beforeHistoryFromSignCallback ? (
                          <Layout>
                            <h3>trung</h3>
                          </Layout>
                        ) : (
                          <Web3ReactManager>
                            <Component {...pageProps} />
                          </Web3ReactManager>
                        )}
                      </Provider>
                    </OreidProvider>
                  </GlobalProvider>
                </>
              )}
            </PersistGate>
          </ReduxProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </Fragment>
  );
}

export default App;
