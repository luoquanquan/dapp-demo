import {
  Button, Card, Space, message,
} from 'antd';
import { useState } from 'react';

function SignMessage({ account }) {
  const handleSignMsg = (msg = 'Hello BTC') => async () => {
    try {
      const ret = await okxwallet.bitcoin.signMessage(
        msg,
        {
          from: account,
        },
      );

      console.log('签名结果 : ', ret);
    } catch (error) {
      message.error(error.message);
    }
  };

  const [watchAssetLoading, setWatchAssetLoading] = useState(false);
  const handleWatchAsset = async () => {
    try {
      setWatchAssetLoading(true);
      const { name } = await okxwallet.bitcoin.watchAsset({ name: 'ordi' });
      message.success(`${name} - 添加成功`);
    } catch (error) {
      message.error(error.message);
      console.log('Current log: error: ', error);
    } finally {
      setWatchAssetLoading(false);
    }
  };

  return (
    <Card title="签名 & 添加代币">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg()}>签名</Button>
            <Button disabled={!account} block onClick={handleSignMsg({ hello: 'Hello BTC' })}>签名传错误参数</Button>
            <Button block onClick={handleWatchAsset} loading={watchAssetLoading}>添加代币</Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
