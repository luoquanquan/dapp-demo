import {
  Alert,
  Button, Card, Space, message,
} from 'antd';
import { useState } from 'react';

function SignMessage({ account }) {
  const [signMsg, setSignMsg] = useState('');

  const handleSignMsg = async () => {
    try {
      const { account: { osmosis } } = await okxwallet.keplr.connect();
      const { signature } = await okxwallet.keplr.signArbitrary(
        'osmosis-1',
        osmosis,
        'Hello Cosmos',
      );

      setSignMsg(signature);
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
              description={signMsg}
            />
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
