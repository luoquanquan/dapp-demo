import {
  Button, Card, Space, message,
} from 'antd';

export default function Connect({ setAccount }) {
  const handleConnect = async () => {
    try {
      const [evmAddress] = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(evmAddress);
    } catch (error) {
      message.error(error.message);
    }
  };

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
