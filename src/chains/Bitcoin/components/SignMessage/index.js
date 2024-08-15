import {
  Button, Card, Space,
} from 'antd-mobile';
import { useState } from 'react';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignMessage({ account }) {
  const handleSignMsg = (msg = 'Hello BTC') => async () => {
    try {
      const ret = await okxwallet.bitcoin.signMessage(
        msg,
        {
          from: account,
        },
      );
      toastSuccess();
      console.log(ret);
    } catch (error) {
      console.log(error);
      toastFail();
    }
  };

  const [watchAssetLoading, setWatchAssetLoading] = useState(false);
  const handleWatchAsset = async () => {
    try {
      setWatchAssetLoading(true);
      await okxwallet.bitcoin.watchAsset({ name: 'ordi' });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
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
