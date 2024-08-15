import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import { toastFail } from '../../../../utils/toast';
import { handleNearResp, wNearContractId } from '../../const';

function SignMessage({ account, provider }) {
  const [loading, setLoading] = useState(false);
  const handleSignMessage = async () => {
    try {
      setLoading(true);

      const message = 'Hello Near';
      // const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(32)));
      const nonce = Buffer.from('4268ebc14ff247f5450d4a8682bec3729a06d268f83b0cb363083ab05b65486b', 'hex');
      const recipient = wNearContractId;

      const resp = await provider.signMessage({
        message,
        nonce,
        recipient,
      });

      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={loading}
          disabled={!account}
          onClick={handleSignMessage}
          style={{ marginBottom: 8 }}
        >
          signMessage
        </Button>
      </Space>
    </Card>
  );
}

export default SignMessage;
