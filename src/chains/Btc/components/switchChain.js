import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function SwitchChain({ provider, getNetwork, disabled }) {
  const [switching, setSwitching] = useState(false);

  const handleSwitchChain = async (chainId) => {
    setSwitching(true);
    try {
      await provider.switchChain(chainId);

      // get network
      getNetwork();
      toastSuccess();
    } catch (err) {
      console.log('switchChain error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to switch chain');
      }
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Card title="switchChain">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={() => handleSwitchChain('btc:mainnet')}
          disabled={disabled}
          loading={switching}
        >
          Switch chain to btc:mainnet
        </Button>
        <Button
          block
          onClick={() => handleSwitchChain('fractal:mainnet')}
          disabled={disabled}
          loading={switching}
        >
          Switch chain to fractal:mainnet
        </Button>
      </Space>
    </Card>
  );
}

export default SwitchChain;
