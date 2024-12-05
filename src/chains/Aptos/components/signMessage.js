import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function SignMessage({ disabled }) {
  const [signing, setSigning] = useState(false);

  const handleSignMessage = async () => {
    setSigning(true);
    try {
      const data = {
        message: 'Hello, world!',
        nonce: '123',
      };
      const result = await window.aptos.signMessage(data);
      console.log('handleSignMessage: ', result);
      toastSuccess();
    } catch (err) {
      console.log('handleSignMessage error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to sign message');
      }
    } finally {
      setSigning(false);
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={handleSignMessage}
          disabled={disabled}
          loading={signing}
        >
          signMessage
        </Button>
      </Space>
    </Card>
  );
}

export default SignMessage;
