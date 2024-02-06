import { Space } from 'antd';
// import * as nearApi from 'near-api-js';
// import { Contract, utils } from 'near-api-js';
import Account from '../../components/Account';
import Connect from '../../components/Connect';
import useConnect from './hooks/useConnect';
import Sender from './components/Sender';
import OneKey from './components/Onekey';

// const {
//   utils: {
//     format: { parseNearAmount },
//   },
// } = nearApi;

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
// const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');

function NEAR() {
  const { account, handleConnect } = useConnect();

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account} />
      <Connect handleConnect={handleConnect} account={account} />
      <OneKey />
      <Sender />
    </Space>
  );
}

export default {
  key: 'NEAR',
  label: 'NEAR',
  children: <NEAR />,
};
