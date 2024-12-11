import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function SignMessage({ provider, disabled }) {
  const [signing, setSigning] = useState(false);

  const handleSignMessage = async (type) => {
    setSigning(true);
    try {
      const result = await provider.signMessage('Hello world!', type);
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
          onClick={() => handleSignMessage('ecdsa')}
          disabled={disabled}
          loading={signing}
        >
          signMessage with ECDSA
        </Button>

        <Button
          block
          onClick={() => handleSignMessage('bip322-simple')}
          disabled={disabled}
          loading={signing}
        >
          signMessage with BIP-322 Simple
        </Button>
      </Space>
    </Card>
  );
}

export default SignMessage;
