import {
  Button, Card, Space, message,
} from 'antd';

function SignMessage({ account }) {
  const handleSignMsg = async () => {
    try {
      const msg = 'Hello Solana';
      const encodedMsg = new TextEncoder().encode(msg);
      const signMsgRet = await solana.signMessage(encodedMsg, 'utf8');
      // eslint-disable-next-line no-console
      console.log('签名结果 : ', signMsgRet);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card title="签名 - 请打开控制台查看签名结果">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg}>签名</Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
