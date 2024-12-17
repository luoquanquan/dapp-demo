import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function SignMessage({ provider, fractalProvider, disabled }) {
  const [signing, setSigning] = useState(false);

  const handleSignMessage = async (chainId, type) => {
    setSigning(true);
    try {
      let result = null;
      if (chainId === 'btc:mainnet') {
        result = await provider.signMessage('Hello world!', type);
      } else {
        result = await fractalProvider.signMessage('Hello world!', type);
      }
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
          onClick={() => handleSignMessage('btc:mainnet', 'ecdsa')}
          disabled={disabled}
          loading={signing}
        >
          signMessage with ECDSA(btc:mainnet)
        </Button>

        <Button
          block
          onClick={() => handleSignMessage('btc:mainnet', 'bip322-simple')}
          disabled={disabled}
          loading={signing}
        >
          signMessage with BIP-322 Simple(btc:mainnet)
        </Button>

        <Button
          block
          onClick={() => handleSignMessage('fractal:mainnet', 'ecdsa')}
          disabled={disabled}
          loading={signing}
        >
          signMessage with ECDSA(fractal:mainnet)
        </Button>

        <Button
          block
          onClick={() => handleSignMessage('fractal:mainnet', 'bip322-simple')}
          disabled={disabled}
          loading={signing}
        >
          signMessage with BIP-322 Simple(fractal:mainnet)
        </Button>
      </Space>
    </Card>
  );
}

export default SignMessage;
