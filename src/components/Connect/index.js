import { message } from 'antd';
import {
  Button, Card, Space,
} from 'antd-mobile';

export default function Connect({
  loading, handleConnect, account, children, handleDisConnect = () => message.error('not supported ~'),
}) {
  return (
    <Card title="Connect status">
      <Space wrap>
        <Button color="primary" loading={loading} disabled={!!account} onClick={handleConnect}>Connect Wallet</Button>
        {children}
        <Button color="danger" loading={loading} disabled={!account} onClick={handleDisConnect}>Disconnect</Button>
      </Space>
    </Card>
  );
}
