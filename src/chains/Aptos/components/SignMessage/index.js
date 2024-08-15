import {
  Button, Card, Space, message,
} from 'antd';
import nacl from 'tweetnacl';

const testMsg = 'Hello Aptos';
function SignMessage({ account }) {
  const handleSignMsg = (msg = testMsg) => async () => {
    try {
      const response = await aptos.signMessage({
        message: msg,
        nonce: '1',
      });

      const { publicKey } = await aptos.account();
      const key = publicKey?.slice(2, 66);
      const verified = nacl.sign.detached.verify(
        Buffer.from(response.fullMessage),
        Buffer.from(response.signature, 'hex'),
        Buffer.from(key, 'hex'),
      );

      if (verified) {
        console.log('签名结果: ', response.signature);
      } else {
        message.error('签名失败');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignMsg()}>签名</Button>
            <Button
              disabled={!account}
              block
              onClick={handleSignMsg({ hello: testMsg })}
            >
              签名传异常参数
            </Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
