import { Card, Space } from 'antd';
import { Button } from 'antd-mobile';
import { useState } from 'react';
import nacl from 'tweetnacl';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toastFail, toastSuccess } from '../../../../utils/toast';

const message = 'hello aptos';
const nonce = 100;

function SignMessage() {
  const {
    signMessage, signMessageAndVerify, account,
  } = useWallet();

  const [loading, setLoading] = useState(false);
  const [signedMessage, setSignedMessage] = useState(null);
  const handleSignMessage = async () => {
    try {
      setLoading(true);
      const resp = await signMessage({ message, nonce });
      console.log(resp);
      setSignedMessage(resp);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const [verifyLoading, setVerifyLoading] = useState(false);
  const handleVerifyMessage = async () => {
    try {
      setVerifyLoading(true);
      const { publicKey } = account;
      const key = publicKey.toString().slice(2);
      const isValid = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage.fullMessage),
        signedMessage.signature.toUint8Array(),
        Buffer.from(key, 'hex'),
      );
      console.log('isValid', isValid);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setVerifyLoading(false);
    }
  };

  const [signMessageAndVerifyLoading, setSignMessageAndVerifyLoading] = useState(false);
  const handleSignMessageAndVerify = async () => {
    try {
      setSignMessageAndVerifyLoading(true);
      const isValid = await signMessageAndVerify({ message, nonce });
      console.log('isValid', isValid);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignMessageAndVerifyLoading(false);
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={loading}
          disabled={!account?.address}
          onClick={handleSignMessage}
          style={{ marginBottom: 8 }}
        >
          signMessage
        </Button>

        <Button
          block
          loading={verifyLoading}
          disabled={!signedMessage}
          onClick={handleVerifyMessage}
          style={{ marginBottom: 8 }}
        >
          verifyMessage
        </Button>

        <Button
          block
          loading={signMessageAndVerifyLoading}
          disabled={!account?.address}
          onClick={handleSignMessageAndVerify}
        >
          signMessageAndVerify
        </Button>
      </Space>
    </Card>
  );
}

export default SignMessage;
