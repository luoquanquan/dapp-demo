import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function ComingSoon({ provider, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleGetBalance = async () => {
    setLoading(true);
    try {
      const result = await provider.getBalance();
      console.log('handleGetBalance: ', result);
      toastSuccess();
    } catch (err) {
      console.log('handleGetBalance error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to get balance');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetInscriptions = async (params = { cursor: 0, size: 20 }) => {
    const { cursor, size } = params;
    setLoading(true);
    try {
      const result = await provider.getInscriptions(cursor, size);
      console.log('handleGetInscriptions: ', result);
      toastSuccess();
    } catch (err) {
      console.log('handleGetInscriptions error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to get inscriptions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTransferNft = async (params = { from: '', to: '', data: '' }) => {
    const { from, to, data } = params;
    setLoading(true);
    try {
      const txHash = await provider.transferNft(from, to, data);
      console.log('handleTransferNft: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handleTransferNft error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to transfer nft');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePushTx = async (params = { rawTx: '' }) => {
    const { rawTx } = params;
    setLoading(true);
    try {
      const txHash = await provider.pushTx(rawTx);
      console.log('handlePushTx: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handlePushTx error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to push tx');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSplitUtxo = async (params = { from: '', amount: 0 }) => {
    const { from, amount } = params;
    setLoading(true);
    try {
      const utxos = await provider.splitUtxo(from, amount);
      console.log('handleSplitUtxo: ', utxos);
      toastSuccess();
    } catch (err) {
      console.log('handleSplitUtxo error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to split utxo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInscribe = async (params = {
    type: 0, from: '', tick: '', tid: '',
  }) => {
    const {
      type, from, tick, tid,
    } = params;
    setLoading(true);
    try {
      const txHash = await provider.inscribe({
        type, from, tick, tid,
      });
      console.log('handleInscribe: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handleInscribe error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to inscribe');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async (
    params = {
      type: 0,
      from: '',
      inscriptions: [],
    },
  ) => {
    const {
      type, from, inscriptions,
    } = params;
    setLoading(true);
    try {
      const txHash = await provider.mint({
        type,
        from,
        inscriptions,
      });
      console.log('handleInscribe: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handleInscribe error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to inscribe');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Coming soon">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={handleGetBalance}
          disabled={disabled}
          loading={loading}
        >
          getBalance
        </Button>
        <Button
          block
          onClick={handleGetInscriptions}
          disabled={disabled}
          loading={loading}
        >
          getInscriptions
        </Button>
        <Button
          block
          onClick={handleTransferNft}
          disabled={disabled}
          loading={loading}
        >
          transferNft
        </Button>
        <Button
          block
          onClick={handlePushTx}
          disabled={disabled}
          loading={loading}
        >
          pushTx
        </Button>
        <Button
          block
          onClick={handleSplitUtxo}
          disabled={disabled}
          loading={loading}
        >
          splitUtxo
        </Button>
        <Button
          block
          onClick={handleInscribe}
          disabled={disabled}
          loading={loading}
        >
          handleInscribe
        </Button>
        <Button
          block
          onClick={handleMint}
          disabled={disabled}
          loading={loading}
        >
          handleMint
        </Button>
      </Space>
    </Card>
  );
}

export default ComingSoon;
