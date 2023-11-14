import {
  Alert,
  Button, Card, Col, Row, Space, message,
} from 'antd';
import { useState } from 'react';

function SignMessage({ account }) {
  const [ethSignRet, setEthSignRet] = useState('');
  const handleEthSign = async () => {
    try {
      // const msg = 'hello world';
      // const hashMsg = '0x' +
      // keccak256(`\x19Ethereum Signed Message:\n${msg.length}${msg}`).toString('hex');
      const hashMsg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ret = await ethereum.request({
        method: 'eth_sign',
        params: [account, hashMsg],
      });
      setEthSignRet(ret);
    } catch (error) {
      message.error(error.message);
    }
  };

  const [personalSignRet, setPersonalSignRet] = useState('');
  const handlePersonalSign = async () => {
    try {
      const msg = 'Example `personal_sign` message';
      const ret = await ethereum.request({
        method: 'personal_sign',
        params: [msg, account, 'Example password'],
      });
      setPersonalSignRet(ret);
    } catch (error) {
      message.error(error.message);
    }
  };

  const [typedDataSignRet, setTypedDataSignRet] = useState('');
  const typedDataMsg = [
    {
      type: 'string',
      name: 'Name',
      value: 'Luo Quan Quan',
    },
    {
      type: 'uint32',
      name: 'age',
      value: '18',
    },
    {
      type: 'string',
      name: 'Hobby',
      value: 'sing dance rap basketball',
    },
  ];
  const handleTypedDataSign = async () => {
    try {
      const ret = await ethereum.request({
        method: 'eth_signTypedData',
        params: [typedDataMsg, account],
      });
      setTypedDataSignRet(ret);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card title="签名">
      <Row gutter={16}>
        <Col span={8}>
          <Card direction="vertical" title="Eth Sign">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button disabled={!account} block onClick={handleEthSign}>eth_sign</Button>
              <Alert
                type="info"
                message="Result"
                description={ethSignRet}
              />
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card direction="vertical" title="Personal Sign">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button disabled={!account} block onClick={handlePersonalSign}>personal_sign</Button>
              <Alert
                type="info"
                message="Result"
                description={personalSignRet}
              />
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card direction="vertical" title="Sign Typed Data">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button disabled={!account} block onClick={handleTypedDataSign}>
                eth_signTypedData
              </Button>
              <Alert
                type="info"
                message="Result"
                description={typedDataSignRet}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default SignMessage;
