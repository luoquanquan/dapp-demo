import {
  Alert,
  Button, Card, Space, message,
} from 'antd';

function SignMessage({ account }) {
  const handleSignMsg = async () => {
    try {
      const msg = 'To avoid digital dognappers, sign below to authenticate with CryptoCorgis';
      const encodedMsg = new TextEncoder().encode(msg);
      const signMsgRet = await okxwallet.solana.signMessage(encodedMsg, 'utf8');
      // eslint-disable-next-line no-console
      console.log('签名结果 : ', signMsgRet);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card title="签名 (signMessage)">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg}>签名</Button>
            <Alert
              type="warning"
              message="Result"
              description="请打开控制台查看"
            />
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
