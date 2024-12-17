import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function Rpc({ provider, fractalProvider, disabled }) {
  const [sending, setSending] = useState(false);

  const handlePushTx = async (chainId = 'btc:mainnet', rawTx) => {
    setSending(true);
    try {
      let txHash = null;
      if (chainId === 'btc:mainnet') {
        txHash = await provider.pushTx(rawTx);
      } else {
        txHash = await fractalProvider.pushTx(rawTx);
      }
      console.log('handlePushTx: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handlePushTx error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to send');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card title="RPC request">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={() => handlePushTx(
            'btc:mainnet',
            '01000000000101b6e447e3730b6c22a4312c51e98a013b8e1514ebe592a75767349b659dd1eb4b0000000000ffffffff020000000000000000536a4c50000d2ab10002ce909734abc6014d89e07b7d1d5aa1d324eb6af71e2860a470d612483853e078120e105d3ea910720edbb89fc9025e3b4d8e0701e44510686281d5484fbb48444129251371047bf8ad5b5fb9010000000000160014841996f8ff255c875c4f8875a7bd036bf64209210246304302203c5ef41b9f17525714ab840dbd1716c2baae14e14db84a18716f97b5d1c3aa3c021f6be45f733d3ce5094b470385d997e797ffab976610c015833b395197be586601210380a033803cdcfae4dda162741774cbf38af31ebdd11e9bba414590d7fe36835400000000',
          )}
          disabled={disabled}
          loading={sending}
        >
          Push Tx(btc:mainnet)
        </Button>
        <Button
          block
          onClick={() => handlePushTx(
            'btc:mainnet',
            '01000000000101b6e447e3730b6c22a4312c51e98a013b8e1514ebe592a75767349b659dd1eb4b0000000000ffffffff020000000000000000536a4c50000d2ab10002ce909734abc6014d89e07b7d1d5aa1d324eb6af71e2860a470d612483853e078120e105d3ea910720edbb89fc9025e3b4d8e0701e44510686281d5484fbb48444129251371047bf8ad5b5fb9010000000000160014841996f8ff255c875c4f8875a7bd036bf64209210246304302203c5ef41b9f17525714ab840dbd1716c2baae14e14db84a18716f97b5d1c3aa3c021f6be45f733d3ce5094b470385d997e797ffab976610c015833b395197be586601210380a033803cdcfae4dda162741774cbf38af31ebdd11e9bba414590d7fe36835400000000',
          )}
          disabled={disabled}
          loading={sending}
        >
          Push Tx(fractal:mainnet)
        </Button>
      </Space>
    </Card>
  );
}

export default Rpc;
