import { Button, Card, Space } from 'antd';
import onekey from '@onekeyfe/onekey-near-provider';

console.log('Current log: onekey: ', onekey);

// const provider = new OneKeyNearProvider();

function OneKey() {
  const near_accounts = async () => {
    // const res = await provider.request({
    //   method: 'near_accounts',
    // });
    // console.log('Current log: res: ', res);
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
