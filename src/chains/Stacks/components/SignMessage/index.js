import {
  Alert,
  Button, Card, Space, message,
} from 'antd';
import { useState } from 'react';

function SignMessage({ account }) {
  const [signMsgRet, setSignMsgRet] = useState('');

  const handleSignMsg = async () => {
    try {
      const msg = 'hello world';
      const { signature } = await window.stacks.signMessage({ message: msg });
      setSignMsgRet(signature);
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
              description={signMsgRet}
            />
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
