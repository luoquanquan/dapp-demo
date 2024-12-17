import {
  Button, Space, Card, TextArea,
} from 'antd-mobile';
import { Input, message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function Psbt({ provider, fractalProvider, disabled }) {
  const [signing, setSigning] = useState(false);
  const [psbtHexArr, setPsbtHexArr] = useState([]);
  const [fractakPsbtHexArr, setFractalPsbtHexArr] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [fractalInputVal, setFractalInputVal] = useState('');
  const [signedTx, setSignedTx] = useState('');
  const [fractalSignedTx, setFractalSignedTx] = useState('');

  const addPsbtInput = (chainId) => {
    if (chainId === 'btc:mainnet') {
      setPsbtHexArr([...psbtHexArr, inputVal]);
      setInputVal('');
    } else {
      setFractalPsbtHexArr([...fractakPsbtHexArr, fractalInputVal]);
      setFractalInputVal('');
    }
  };

  const handleSignPsbt = async (chainId) => {
    setSigning(true);
    try {
      const options = {
        autoFinalized: true,
      };
      let hexStr = null;
      if (chainId === 'btc:mainnet') {
        hexStr = await provider.signPsbt(psbtHexArr[0], options);
        setSignedTx(hexStr);
      } else {
        hexStr = await fractalProvider.signPsbt(fractakPsbtHexArr[0], options);
        setFractalSignedTx(hexStr);
      }
      console.log('handleSignPsbt: ', hexStr);
      toastSuccess();
    } catch (err) {
      console.log('handleSignPsbt error: ', err, err.code);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to sign psbt');
      }
    } finally {
      setSigning(false);
    }
  };

  const handleSignPsbts = async (chainId) => {
    setSigning(true);
    try {
      let hexStr = null;
      if (chainId === 'btc:mainnet') {
        hexStr = await provider.signPsbts(psbtHexArr, psbtHexArr.map(() => ({
          autoFinalized: true,
        })));
      } else {
        hexStr = await fractalProvider.signPsbts(
          fractakPsbtHexArr,
          fractakPsbtHexArr.map(() => ({
            autoFinalized: true,
          })),
        );
      }
      console.log('handleSignPsbts: ', hexStr);
      if (chainId === 'btc:mainnet') {
        setSignedTx(hexStr);
      } else {
        setFractalSignedTx(hexStr);
      }
      toastSuccess();
    } catch (err) {
      console.log('handleSignPsbts error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to sign psbts');
      }
    } finally {
      setSigning(false);
    }
  };

  const handlePushPsbt = async (chainId) => {
    setSigning(true);
    try {
      let txHash = null;
      if (chainId === 'btc:mainnet') {
        txHash = await provider.pushPsbt(signedTx);
      } else {
        txHash = await fractalProvider.pushPsbt(fractalSignedTx);
      }
      console.log('handlePushPsbt: ', txHash);
      toastSuccess();
    } catch (err) {
      console.log('handlePushPsbt error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to send');
      }
    } finally {
      setSigning(false);
    }
  };

  return (
    <>
      <Card title="Psbt(btc:mainnet)">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            {psbtHexArr.map((val, idx) => (
              <TextArea key={idx} value={val} disabled />
            ))}
          </div>
          <Input
            placeholder="psbt hex"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
            }}
          />
          <Button block onClick={addPsbtInput}>
            add psbt input
          </Button>
          <br />
          <Button
            block
            onClick={() => handleSignPsbt('btc:mainnet')}
            disabled={disabled || psbtHexArr.length === 0}
            loading={signing}
          >
            sign psbt(btc:mainnet)
          </Button>

          <Button
            block
            onClick={() => handleSignPsbts('btc:mainnet')}
            disabled={disabled || psbtHexArr.length === 0}
            loading={signing}
          >
            sign psbts(btc:mainnet)
          </Button>

          <br />
          <div>
            <TextArea
              name="btc:mainnet - Signed Tx"
              key="signed-tx"
              value={signedTx}
              disabled
            />
          </div>
          <br />

          <Button
            block
            onClick={() => handlePushPsbt('btc:mainnet')}
            disabled={disabled || !signedTx}
            loading={signing}
          >
            Push Psbt(btc:mainnet)
          </Button>
        </Space>
      </Card>

      <Card title="Psbt(fractal:mainnet)">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            {fractakPsbtHexArr.map((val, idx) => (
              <TextArea key={`fractal-psbtHex-${idx}`} value={val} disabled />
            ))}
          </div>
          <Input
            placeholder="psbt hex"
            value={fractalInputVal}
            onChange={(e) => {
              setFractalInputVal(e.target.value);
            }}
          />
          <Button block onClick={addPsbtInput}>
            add psbt input
          </Button>
          <br />
          <Button
            block
            onClick={() => handleSignPsbt('fractal:mainnet')}
            disabled={disabled || fractakPsbtHexArr.length === 0}
            loading={signing}
          >
            sign psbt(fractal:mainnet)
          </Button>

          <Button
            block
            onClick={() => handleSignPsbts('fractal:mainnet')}
            disabled={disabled || fractakPsbtHexArr.length === 0}
            loading={signing}
          >
            sign psbts(fractal:mainnet)
          </Button>

          <br />
          <div>
            <TextArea
              name="fractal:mainnet - Signed Tx"
              key="signed-tx"
              value={fractalSignedTx}
              disabled
            />
          </div>
          <br />

          <Button
            block
            onClick={() => handlePushPsbt('fractal:mainnet')}
            disabled={disabled || !fractalSignedTx}
            loading={signing}
          >
            Push Psbt(fractal:mainnet)
          </Button>
        </Space>
      </Card>
    </>
  );
}

export default Psbt;
