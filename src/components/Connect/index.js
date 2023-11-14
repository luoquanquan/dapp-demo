import {
  Button, Card, Space,
} from 'antd';

export default function Connect({ handleConnect }) {
  const handleDisConnect = () => {
    okxwallet.disconnect();
  };

  return (
    <Card title="连接状态">
      <Space>
        <Button onClick={handleConnect}>连接钱包</Button>
        <Button onClick={handleDisConnect}>断开连接</Button>
      </Space>
    </Card>
  );
}
