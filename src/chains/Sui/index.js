import { Space } from 'antd-mobile';
import { useEffect } from 'react';

import {
  SuiClientProvider,
  WalletProvider,
  ConnectButton,
} from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import SignTransaction from './components/SignTransaction';
import { networkConfig } from './networkConfig';
import BlackAddress from '../../components/BlackAddress';
import { blackAddress, strongBlackAddress } from './const';

import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';

const queryClient = new QueryClient();
class AppReadyEvent extends Event {
  #detail;

  get detail() {
    return this.#detail;
  }

  get type() {
    return 'wallet-standard:app-ready';
  }

  constructor(api) {
    super('wallet-standard:app-ready', {
      bubbles: false,
      cancelable: false,
      composed: false,
    });
    this.#detail = api;
  }

  /** @deprecated */
  preventDefault() {
    throw new Error('preventDefault cannot be called');
  }

  /** @deprecated */
  stopImmediatePropagation() {
    throw new Error('stopImmediatePropagation cannot be called');
  }

  /** @deprecated */
  stopPropagation() {
    throw new Error('stopPropagation cannot be called');
  }
}
function Sui() {
  useEffect(() => {
    try {
      window.addEventListener(
        'wallet-standard:register-wallet',
        ({ detail: callback }) =>
          callback({
            register: (sol) => {
              console.log(sol, 'register-wallet callback');
            },
          }),
      );
    } catch (error) {
      console.error(
        'wallet-standard:register-wallet event listener could not be added\n',
        error,
      );
    }
    try {
      window.dispatchEvent(
        new AppReadyEvent({
          register: (sol) => {
            console.log(sol, 'app ready callback');
          },
        }),
      );
    } catch (error) {
      console.error(
        'wallet-standard:app-ready event could not be dispatched\n',
        error,
      );
    }
  }, []);
  if (!window.sui) {
    return <DontHaveWallet chain={key} />;
  }
  return (
    <Theme appearance="light">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
          <WalletProvider autoConnect>
            <Space direction="vertical" style={{ width: '100%' }}>
              <ConnectButton />

              <SignTransaction />

              <BlackAddress
                type={BlackAddress.typeMap.eoa}
                address={blackAddress}
              />
              <BlackAddress
                type={BlackAddress.typeMap.strongEoa}
                address={strongBlackAddress}
              />
            </Space>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  );
}

const key = 'Sui';
export default {
  key,
  children: <Sui />,
};
