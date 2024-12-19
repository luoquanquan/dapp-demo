import {
  Col, Row,
} from 'antd';
import { useState } from 'react';
import { Button, Card, Space } from 'antd-mobile';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignMessageItem({ title, account, msg }) {
  const [signEdRet, setSignEdRet] = useState('');

  const handleSign = async () => {
    try {
      const ret = await tronWeb.trx.signMessageV2(msg);
      console.log(ret);
      setSignEdRet(ret);
      toastSuccess();
    } catch (error) {
      toastFail();
    }
  };

  const handleVerifySignature = async () => {
    try {
      const base58Address = await tronWeb.trx.verifyMessageV2(msg, signEdRet);
      console.log(base58Address);
      if (base58Address === account) {
        toastSuccess('Verify Succeed, you have the account Bro ~');
      } else {
        throw new Error('Verify Failed');
      }
    } catch (error) {
      toastFail('Verify Failed, please check your wallet ~');
    }
  };

  return (
    <Col xs={24} lg={6}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!account}
          onClick={handleSign}
        >
          {title}
        </Button>

        <Button
          block
          disabled={!account || !signEdRet}
          onClick={handleVerifySignature}
        >
          verifySignature
        </Button>
      </Space>

    </Col>
  );
}

function SignMessage({ account }) {
  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={6}>
          <SignMessageItem title="signMessage" account={account} msg="Hello Tron" />
          <SignMessageItem title="signMessage with approval" account={account} msg="0a02ddef220847fff515ea79f0dd40a8eaa2e3b3315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541d9edd5604bdfd83233a388330b009a4c118cd24f121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244d73dd623000000000000000000000000416d2d4db7b59c734bd10abdd5fe0b13cef23e2600000000000000000000000000000000000000000000000000000000000000ff7086a19fe3b33190018087a70e" />
          <SignMessageItem title="signMessage with approval" account={account} msg="0a02ddd72208280dac71fe29512d40e8b79ee3b3315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541d9edd5604bdfd83233a388330b009a4c118cd24f121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244d73dd623000000000000000000000000416d2d4db7b59c734bd10abdd5fe0b13cef23e2600000000000000000000000fffffffffffffffffffffffffffffffffffffffff709cea9ae3b33190018087a70e" />
          <SignMessageItem title="signMessage with approval gray" account={account} msg="0a02ddbc2208a6facc02ac1c40cc4080bf99e3b3315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541d9edd5604bdfd83233a388330b009a4c118cd24f121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244d73dd6230000000000000000000000009fda016c6b65510c2fbefc942d7358773245c17200000000000000000000000000000000000000000000000000000000000000ff70868496e3b33190018087a70e" />
        </Row>
      </Space>
    </Card>
  );
}

export default SignMessage;
