import {
  Button, Card, Space,
} from 'antd-mobile';
import { useState } from 'react';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import { toastFail, toastSuccess } from '../../../../utils/toast';

const msg = 'Hello Solana';
const encodedMsg = decodeUTF8(msg);

function SignMessage({ account, wallet }) {
  const [loading, setLoading] = useState(false);
  const [signEdRet, setSignEdRet] = useState(null);

  const handleSignMsg = async () => {
    try {
      setLoading(true);
      const ret = await wallet.signMessage(encodedMsg);
      console.log(ret);
      setSignEdRet(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignature = async () => {
    try {
      setLoading(true);
      const verified = nacl.sign.detached.verify(
        encodedMsg,
        signEdRet,
        solana.publicKey.toBuffer(),
      );
      console.log(verified);
      toastSuccess('Verify Succeed, you have the account Bro ~');
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space style={{ width: '100%' }}>
            <Button loading={loading} disabled={!account && !signEdRet} onClick={handleSignMsg}>signMessage</Button>
            <Button loading={loading} disabled={!account || !signEdRet} onClick={handleVerifySignature}>verifySignature</Button>
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignMessage;
