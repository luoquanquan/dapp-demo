import { Card, Space } from 'antd';
import { Button } from 'antd-mobile';
import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignTransaction() {
  const {
    account,
  } = useWallet();

  const [handleSendAptLoading, setHandleSendAptLoading] = useState(false);
  const handleSendApt = async () => {
    try {
      setHandleSendAptLoading(true);
      const resp = await window.aptos.signAndSubmitTransaction({
        arguments: ['0x0e0b96a300ba50c10777901fb7437391b5d5ddb627f482b33b47d29202d0e0ff', 1000],
        function: '0x1::coin::transfer',
        type: 'entry_function_payload',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
      });
      console.log(resp);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setHandleSendAptLoading(false);
    }
  };

  return (
    <Card title="SignTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={handleSendAptLoading}
          disabled={!account?.address}
          onClick={handleSendApt}
          style={{ marginBottom: 8 }}
        >
          send APT
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransaction;
