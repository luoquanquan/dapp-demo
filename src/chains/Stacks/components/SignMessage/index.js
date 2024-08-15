import {
  Button, Card, Space, message,
} from 'antd';

const testMsg = 'Hello Stacks';

function SignMessage({ account }) {
  const handleSignMsg = (msg = testMsg) => async () => {
    try {
      const { signature } = await window.stacks.signMessage({ message: msg });
      console.log('签名结果: ', signature);
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
              传错参数
            </Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
