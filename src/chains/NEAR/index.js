import { Button, Space } from 'antd-mobile';
import Account from '../../components/Account';
import useConnect from './hooks/useConnect';
import DontHaveWallet from '../../components/DontHaveWallet';
import Connect from '../../components/Connect';
import SignTransaction from './components/SignTransaction';
import SignMessage from './components/SignMessage';

function NEAR() {
  const {
    loading, account, access, handleConnect, handleDisConnect, handleConnectWithContractId, provider,
  } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account}>
        {access && <div>{access.publicKey}</div>}
      </Account>

      <Connect loading={loading} handleConnect={handleConnect} handleDisConnect={handleDisConnect} account={account}>
        <Button loading={loading} disabled={account} onClick={handleConnectWithContractId}>
          handleSignIn with contractId
        </Button>
      </Connect>

      <SignMessage account={account} access={access} provider={provider} />

      <SignTransaction account={account} access={access} provider={provider} />
    </Space>
  );
}

const key = 'NEAR';
export default {
  key,
  children: window.near ? <NEAR /> : <DontHaveWallet chain={key} />,
};
