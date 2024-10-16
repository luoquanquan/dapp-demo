import {
  Space,
} from 'antd-mobile';

import { SuiClientProvider, WalletProvider, ConnectButton } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import SignTransaction from './components/SignTransaction';
import { networkConfig } from './networkConfig';
import BlackAddress from '../../components/BlackAddress';
import { blackAddress, strongBlackAddress } from './const';

import '@mysten/dapp-kit/dist/index.css';
import '@radix-ui/themes/styles.css';

const queryClient = new QueryClient();

function Sui() {
  return (
    <Theme appearance="light">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
          <WalletProvider autoConnect>
            <Space direction="vertical" style={{ width: '100%' }}>
              <ConnectButton />

              <SignTransaction />

              <BlackAddress type={BlackAddress.typeMap.eoa} address={blackAddress} />
              <BlackAddress type={BlackAddress.typeMap.strongEoa} address={strongBlackAddress} />
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
