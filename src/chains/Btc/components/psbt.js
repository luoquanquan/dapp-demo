import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { useState } from 'react';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastSuccess } from '../../../utils/toast';

function Psbt({ provider, disabled }) {
  const [signing, setSigning] = useState(false);

  const handleSignPsbt = async () => {
    setSigning(true);
    try {
      const psbtHex = '';
      const options = {
        autoFinalized: true,
        toSignInput: [
          {
            /*
            index - number: the input to sign
            address - string: the address of the corresponding private key to be used for signing
            publicKey - string: the public key of the corresponding private key to be used for signature
            sighashTypes - number[]: (optional) sighashTypes
            disableTweakSigner - boolean: (optional) When signing and unlocking Taproot addresses, tweakSigner is used to generate signatures by default, enable this option to allow signing with the original private key.
            */
            index: 0,
            address: '',
            publicKey: '',
            sighashTypes: [],
            disableTweakSigner: false,
          },
        ],
      };
      const hexStr = await provider.signPsbt(psbtHex, options);
      console.log('handleSignAndPushPsbt: ', hexStr);
      toastSuccess();
    } catch (err) {
      console.log('handleSignAndPushPsbt error: ', err);
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        message.error('Failed to sign psbt');
      }
    } finally {
      setSigning(false);
    }
  };

  const handleSignPsbts = async () => {
    setSigning(true);
    try {
      const txInputs = [];
      txInputs.push({
        txId: '1e0f92720ef34ab75eefc5d691b551fb2f783eac61503a69cdf63eb7305d2306',
        vOut: 2,
        amount: 341474,
        address: 'tb1q8h8....mjxzny',
        privateKey: '0s79......ldjejke',
        publicKey: 'tb1q8h8....mjxzny',
        bip32Derivation: [
          {
            masterFingerprint: 'a22e8e32',
            pubkey: 'tb1q8h8....mjxzny',
            path: "m/49'/0'/0'/0/0",
          },
        ],
      });
      const options = {
        autoFinalized: true,
        toSignInput: [
          {
            /* index - number: the input to sign
address - string: the address of the corresponding private key to be used for signing
publicKey - string: the public key of the corresponding private key to be used for signature
sighashTypes - number[]: (optional) sighashTypes
disableTweakSigner - boolean: (optional) When signing and unlocking Taproot addresses, tweakSigner is used to generate signatures by default, enable this option to allow signing with the original private key.
*/
            index: 0,
            address: '',
            publicKey: '',
            sighashTypes: [],
            disableTweakSigner: false,
          },
        ],
      };
      const hexStr = await provider.signPsbts(txInputs, options);
      console.log('handleSignPsbts: ', hexStr);
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

  return (
    <Card title="Psbt">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={() => handleSignPsbt()}
          disabled={disabled}
          loading={signing}
        >
          sign psbt
        </Button>

        <Button
          block
          onClick={() => handleSignPsbts()}
          disabled={disabled}
          loading={signing}
        >
          sign psbts
        </Button>
      </Space>
    </Card>
  );
}

export default Psbt;
