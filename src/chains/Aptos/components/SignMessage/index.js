import {
  Alert,
  Button, Card, Space, message,
} from 'antd';
import nacl from 'tweetnacl';
import { useState } from 'react';

function SignMessage({ account }) {
  const [signMsg, setSignMsg] = useState('');

  const handleSignMsg = async () => {
    try {
      const response = await okxwallet.aptos.signMessage({
        message: 'hello',
        nonce: '1',
      });

      const { publicKey } = await window.okxwallet.aptos.account();
      const key = publicKey?.slice(2, 66);
      const verified = nacl.sign.detached.verify(
        Buffer.from(response.fullMessage),
        Buffer.from(response.signature, 'hex'),
        Buffer.from(key, 'hex'),
      );

      if (verified) {
        setSignMsg(response.signature);
      } else {
        throw new Error('签名异常');
      }
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
