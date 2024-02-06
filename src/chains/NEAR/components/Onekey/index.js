import { Button, Card, Space } from 'antd';
import { OneKeyNearProvider } from '@onekeyfe/onekey-near-provider';

const provider = new OneKeyNearProvider();
function OneKey() {
  const near_accounts = async () => {
    const res = await provider.requestSignIn();
    console.log('Current log: res: ', res);
  };

  return (
    <Card title="OneKey">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button onClick={near_accounts}>near_accounts</Button>
      </Space>
    </Card>
  );
}

export default OneKey;
