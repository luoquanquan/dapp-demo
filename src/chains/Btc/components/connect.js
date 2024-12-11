import { Button, Card, Space } from 'antd-mobile';

export default function Connect({
  loading,
  connect,
  disconnect,
  account,
  children,
}) {
  return (
    <Card title="Connect status">
      <Space wrap>
        <Button
          color="primary"
          loading={loading}
          disabled={!!account}
          onClick={() => connect && connect()}
        >
          Connect Wallet
        </Button>
        {children}
        <Button
          color="danger"
          loading={loading}
          disabled={!account}
          onClick={() => disconnect && disconnect()}
        >
          Disconnect
        </Button>
      </Space>
    </Card>
  );
}
