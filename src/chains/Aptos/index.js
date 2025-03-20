import { Space } from 'antd';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { BitgetWallet, BitgetWalletName } from '@bitget-wallet/aptos-wallet-adapter';
import { OKXWalletName, OKXWallet } from '@okwallet/aptos-wallet-adapter';
import { Network } from '@aptos-labs/ts-sdk';
import { Button } from 'antd-mobile';
import DontHaveWallet from '../../components/DontHaveWallet';
import Connect from '../../components/Connect';
import useConnect from './hooks/useConnect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';

function AptosWrap() {
  const {
    loading, account, handleConnect, handleDisconnect,
  } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account?.address?.toString()} />
      <Connect connectText="Connect Bitget Wallet" loading={loading} handleConnect={() => handleConnect(BitgetWalletName)} handleDisConnect={handleDisconnect} account={account}>
        <Button color="primary" loading={loading} disabled={!!account} onClick={() => handleConnect(OKXWalletName)}>Connect OKX Wallet</Button>
      </Connect>
      <SignMessage />
    </Space>
  );
}

function Aptos() {
  const wallets = [
    new OKXWallet(),
    new BitgetWallet(),
  ];
  return (
    <AptosWalletAdapterProvider
      autoConnect
      plugins={wallets}
      dappConfig={{ network: Network.MAINNET }}
    >
      <AptosWrap />
    </AptosWalletAdapterProvider>
  );
}

const key = 'Aptos';
export default {
  key,
  children: window.aptos ? <Aptos /> : <DontHaveWallet chain={key} />,
};
