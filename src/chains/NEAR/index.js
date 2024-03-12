import {
  Button,
  Card, Col, Row, Space,
} from 'antd';
import Account from '../../components/Account';
import useConnect from './hooks/useConnect';
import Common from './components/Common';
import DappSelf from './components/DappSelf';

function NEAR() {
  const {
    loading, account, access, handleConnect, handleDisConnect, handleConnectWithContractId,
  } = useConnect();

  console.log('Current log: access: ', access);
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Account account={account}>
        {access && <div>{access.publicKey}</div>}
      </Account>

      <Card title="连接状态">
        <Space>
          <Button loading={loading} type="primary" disabled={account} onClick={handleConnect}>连接钱包</Button>
          <Button loading={loading} type="primary" disabled={account} onClick={handleConnectWithContractId}>连接钱包绑定合约地址</Button>
          <Button
            loading={loading}
            danger
            disabled={!account}
            onClick={handleDisConnect}
          >
            断开连接
          </Button>
        </Space>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Common account={account} />
        </Col>
        <Col span={12}>
          <DappSelf account={account} access={access} />
        </Col>
      </Row>
    </Space>
  );
}

export default {
  key: 'NEAR',
  label: 'NEAR',
  children: <NEAR />,
};
