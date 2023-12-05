import {
  Alert,
  Button, Card, Space, message,
} from 'antd';
import { useState } from 'react';

function SignMessage({ account }) {
  const [signMsgRet, setSignMsgRet] = useState('');

  const handleSignMsg = async () => {
    try {
      const data = {
        domain: {
          name: 'OKX',
          chainId: 'SN_MAIN',
          version: '0.0.1',
        },
        types: {
          StarkNetDomain: [
            {
              name: 'name',
              type: 'felt',
            },
          ],
          Message: [
            {
              name: 'message',
              type: 'felt',
            },
          ],
        },
        primaryType: 'Message',
        message: {
          message: 'hello',
        },
      };

      const [r, s] = await okxwallet.starknet.account.signMessage(data);
      setSignMsgRet(`
        r: ${r}
        s: ${s}
      `);
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
              message="Result R"
              description={signMsgRet}
            />
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
