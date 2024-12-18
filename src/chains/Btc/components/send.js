import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function Send({
  provider, fractalProvider, account, disabled,
}) {
  console.log('account: ', account);
  const [sending, setSending] = useState(false);

  const handleSend = async (chainId, params = { from: '', to: '', value: '' }) => {
    const {
      from, to, value, satBytes, memo, memoPos,
    } = params;
    setSending(true);
    try {
      let txHash = null;
      if (chainId === 'btc:mainnet') {
        txHash = await provider.send({
          from, to, value, satBytes, memo, memoPos,
        });
      } else {
        txHash = await fractalProvider.send({
          from, to, value, satBytes, memo, memoPos,
        });
      }
      console.log('handleSend: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handleSend error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to send');
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendBitcoin = async (chainId, params = { to: '', amount: 10 }) => {
    const { to = '', amount = 10, feeRate } = params;
    setSending(true);
    try {
      const options = {};
      if (feeRate) {
        options.feeRate = feeRate;
      }
      let txHash = null;
      if (chainId === 'btc:mainnet') {
        txHash = await provider.sendBitcoin(to, amount, options);
      } else {
        txHash = await fractalProvider.sendBitcoin(to, amount, options);
      }
      console.log('handleSendBitcoin: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handleSendBitcoin error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to send bitcoin');
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendInscription = async (chainId, params = {
    to: '',
    inscriptionId: '',
  }) => {
    const { to = '', inscriptionId = '', options = { feeRate: '' } } = params;
    setSending(true);
    try {
      let txHash = null;
      if (chainId === 'btc:mainnet') {
        txHash = await provider.sendInscription(to, inscriptionId, options);
      } else {
        txHash = await fractalProvider.sendInscription(to, inscriptionId, options);
      }
      console.log('handleSendInscription: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handleSendInscription error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to send inscription');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card title="Send">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={() => handleSend('btc:mainnet', {
            from: account.address,
            to: account.address,
            value: '0.000001',
          })}
          disabled={disabled}
          loading={sending}
        >
          send(btc:mainnet)
        </Button>
        <Button
          block
          onClick={() => handleSend('fractal:mainnet', {
            from: account.address,
            to: account.address,
            value: '0.000001',
          })}
          disabled={disabled}
          loading={sending}
        >
          send(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          onClick={() => handleSendBitcoin('btc:mainnet', {
            to: 'bc1p7pgnqe87red4cvd7ml6rh9pl9ufpr522k2y3dpeyrvfc6g2g3r3s3ae9dr',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Taproot Address(btc:mainnet)
        </Button>

        <Button
          block
          onClick={() => handleSendBitcoin('btc:mainnet', {
            to: 'bc1p7pgnqe87red4cvd7ml6rh9pl9ufpr522k2y3dpeyrvfc6g2g3r3s3ae9dr',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Taproot Address(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          onClick={() => handleSendBitcoin('btc:mainnet', {
            to: '19FSGZyDM3KmHpaCWwDrkfaz8nmTEBfwcR',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Legacy Address(btc:mainnet)
        </Button>
        <Button
          block
          onClick={() => handleSendBitcoin('fractal:mainnet', {
            to: '19FSGZyDM3KmHpaCWwDrkfaz8nmTEBfwcR',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Legacy Address(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          onClick={() => handleSendBitcoin('btc:mainnet', {
            to: '3BNpEQEaGzPWutsqa2h55ZAHLtPMP39a5P',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Nested SegWit Address(btc:mainnet)
        </Button>
        <Button
          block
          onClick={() => handleSendBitcoin('fractal:mainnet', {
            to: '3BNpEQEaGzPWutsqa2h55ZAHLtPMP39a5P',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Nested SegWit Address(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          onClick={() => handleSendBitcoin('btc:mainnet', {
            to: 'bc1qjlgnuyaugzfhnnjjnhrjc2333vfk4rv8h4f05d',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Native SegWit Address(btc:mainnet)
        </Button>
        <Button
          block
          onClick={() => handleSendBitcoin('fractal:mainnet', {
            to: 'bc1qjlgnuyaugzfhnnjjnhrjc2333vfk4rv8h4f05d',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin to Native SegWit Address(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          onClick={() => handleSendBitcoin('btc:mainnet', { feeRate: 1 })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin with fee rate(btc:mainnet)
        </Button>

        <Button
          block
          onClick={() => handleSendBitcoin('fractal:mainnet', { feeRate: 1 })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin with fee rate(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          color="danger"
          onClick={() => handleSendBitcoin('btc:mainnet', {
            to: '0x238193be9e80e68eace3588b45d8cf4a7eae0fa3',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin with EVM address(btc:mainnet)
        </Button>
        <Button
          block
          color="danger"
          onClick={() => handleSendBitcoin('fractal:mainnet', {
            to: '0x238193be9e80e68eace3588b45d8cf4a7eae0fa3',
          })}
          disabled={disabled}
          loading={sending}
        >
          send Bitcoin with EVM address(fractal:mainnet)
        </Button>
        <br />
        <Button
          block
          onClick={() => handleSendInscription('btc:mainnet', {
            // to: 'bc1peqgjr3cwl09mmsh6kvjsvv3ffu4waha00x7xrqrt85wt3zgdwphs72ctnu',
            // inscriptionId:
            //     'bf8ed84463c0a82da6292c9a6d90102417c3864ad1a2e8ba2735d58a153fab54i0',
          })}
          disabled={disabled}
          loading={sending}
        >
          send inscription(btc:mainnet)
        </Button>

        <Button
          block
          onClick={() => handleSendInscription('fractal:mainnet', {
            // to: 'bc1peqgjr3cwl09mmsh6kvjsvv3ffu4waha00x7xrqrt85wt3zgdwphs72ctnu',
            // inscriptionId:
            //     'bf8ed84463c0a82da6292c9a6d90102417c3864ad1a2e8ba2735d58a153fab54i0',
          })}
          disabled={disabled}
          loading={sending}
        >
          send inscription(fractal:mainnet)
        </Button>
      </Space>
    </Card>
  );
}

export default Send;
