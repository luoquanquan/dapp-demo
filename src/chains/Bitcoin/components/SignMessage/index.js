import {
  Button, Card, Space, message,
} from 'antd';

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

  return (
    <Card title="签名 (signMessage) 请打开控制台查看签名结果">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg()}>签名</Button>
            <Button disabled={!account} block onClick={handleSignMsg({ hello: 'Hello BTC' })}>签名传错误参数</Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
