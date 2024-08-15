import { Space } from 'antd';

import useConnect from './hooks/useConnect';
import Connect from '../../components/Connect';
import Account from '../../components/Account';
import SignMessage from './components/SignMessage';
import SignTransaction from './components/SignTransaction';
import DontHaveWallet from '../../components/DontHaveWallet';
import BlackAddress from '../../components/BlackAddress';
import { grayTronAddress, tronStrongBlackEoaAddress } from '../../utils/const';

function Tron() {
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <SignMessage account={account} />
      <SignTransaction account={account} />
      <BlackAddress type={BlackAddress.typeMap.eoa} address={grayTronAddress} />
      <BlackAddress type={BlackAddress.typeMap.strongEoa} address={tronStrongBlackEoaAddress} />
    </Space>
  );
}

const key = 'Tron';
export default {
  key,
  children: window.tronLink ? <Tron /> : <DontHaveWallet chain={key} />,
};
