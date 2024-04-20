import {
  Alert,
  Button, Card, Col, Row, Space, message, Popover,
} from 'antd';
import { useState } from 'react';
import GetEncryptPublicKey from './components/GetEncryptPublicKey';
import Permit from './components/Permit';

function SignMessage({ account, chainId }) {
  const [eth_signLoading, setEth_signLoading] = useState(false);
  const [ethSignRet, setEthSignRet] = useState('');
  const eth_sign = async () => {
    try {
      setEth_signLoading(true);
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
    } finally {
      setEth_signLoading(false);
    }
  };

  const [personal_signLoading, setPersonal_signLoading] = useState(false);
  const [personalSignRet, setPersonalSignRet] = useState('');
  const handlePersonalSign = (msg = 'Example `personal_sign` message') => async () => {
    try {
      setPersonal_signLoading(true);
      const ret = await ethereum.request({
        method: 'personal_sign',
        params: [msg, account, 'Example password'],
      });
      setPersonalSignRet(ret);
    } catch (error) {
      message.error(error.message);
    } finally {
      setPersonal_signLoading(false);
    }
  };

  const [typedDataSignLoading, setTypedDataSignLoading] = useState(false);
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
      setTypedDataSignLoading(true);
      const ret = await ethereum.request({
        method: 'eth_signTypedData',
        params: [typedDataMsg, account],
      });
      setTypedDataSignRet(ret);
    } catch (error) {
      message.error(error.message);
    } finally {
      setTypedDataSignLoading(false);
    }
  };

  const [eth_signTypedData_v3Loading, setEth_signTypedData_v3Loading] = useState(false);
  const [eth_signTypedData_v3Ret, setEth_signTypedData_v3Ret] = useState('');
  const eth_signTypedData_v3 = async () => {
    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          test: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };

    try {
      setEth_signTypedData_v3Loading(false);
      const ret = await ethereum.request({
        method: 'eth_signTypedData_v3',
        params: [account, JSON.stringify(msgParams)],
      });
      setEth_signTypedData_v3Ret(ret);
    } catch (error) {
      message.error(error.message);
    } finally {
      setEth_signTypedData_v3Loading(false);
    }
  };

  const [eth_signTypedData_v4Ret, setEth_signTypedData_v4Ret] = useState(null);
  const [eth_signTypedData_v4Loading, setEth_signTypedData_v4Loading] = useState(false);
  const eth_signTypedData_v4 = ({ verifyingContract = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC', fakeMsg = false } = {}) => async () => {
    const msgParams = {
      domain: {
        chainId: chainId.toString(),
        name: 'Ether Mail',
        verifyingContract,
        version: '1',
      },
      message: fakeMsg ? {
        '⁢target＂:＂THIS IS THE FAKE TARGET＂,＂message':
          'THIS IS THE FAKE MESSAGE＂⁢}⁢ }⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx⁢xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      } : {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };

    try {
      setEth_signTypedData_v4Loading(true);
      const ret = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log('Current log: ret: ', ret);
      setEth_signTypedData_v4Ret(ret);
    } catch (error) {
      message.error(error.message);
    } finally {
      setEth_signTypedData_v4Loading(false);
    }
  };

  return (
    <Card title="签名">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card direction="vertical" title="Eth Sign">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  loading={eth_signLoading}
                  disabled={!account}
                  block
                  onClick={eth_sign}
                >
                  eth_sign

                </Button>
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
                <Button
                  block
                  disabled={!account}
                  onClick={handlePersonalSign()}
                  loading={personal_signLoading}
                >
                  personal_sign
                </Button>
                <Button
                  block
                  disabled={!account}
                  onClick={handlePersonalSign('0x010000000f1088000000000055f7428300000001fe0065d1d2ad2105ff003cff5c3c80db8b05601f46c35b79f5c6ff3ef6f703fc')}
                  loading={personal_signLoading}
                >
                  personal_sign_with_Garbled
                </Button>
                <Button
                  block
                  disabled={!account}
                  onClick={handlePersonalSign('我叫罗圈圈')}
                  loading={personal_signLoading}
                >
                  personal_sign_with_Chinese_char
                </Button>
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
                <Button
                  block
                  disabled={!account}
                  loading={typedDataSignLoading}
                  onClick={handleTypedDataSign}
                >
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
        <Row gutter={8}>
          <Col span={6}>
            <Card direction="vertical" title="Sign Typed Data V3">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  disabled={!account}
                  onClick={eth_signTypedData_v3}
                  loading={eth_signTypedData_v3Loading}
                >
                  eth_signTypedData_v3
                </Button>
                <Alert
                  type="info"
                  message="Result"
                  description={eth_signTypedData_v3Ret}
                />
              </Space>
            </Card>
          </Col>
          <Col span={6}>
            <Card direction="vertical" title="Sign Typed Data V4">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  disabled={!account}
                  onClick={eth_signTypedData_v4()}
                  loading={eth_signTypedData_v4Loading}
                >
                  eth_signTypedData_v4
                </Button>
                <Button
                  block
                  disabled={!account}
                  onClick={eth_signTypedData_v4({ verifyingContract: '34567890ihdauhfljadfja' })}
                  loading={eth_signTypedData_v4Loading}
                >
                  eip712NotStandard
                </Button>
                <Button
                  block
                  disabled={!account}
                  onClick={eth_signTypedData_v4({ fakeMsg: true })}
                  loading={eth_signTypedData_v4Loading}
                >
                  longSignText
                </Button>
                <Popover content="eip712NotStandard & longSignText">
                  <Button
                    block
                    disabled={!account}
                    onClick={eth_signTypedData_v4({ verifyingContract: '34567890ihdauhfljadfja', fakeMsg: true })}
                    loading={eth_signTypedData_v4Loading}
                  >
                    both
                  </Button>
                </Popover>

                <Alert
                  type="info"
                  message="Result"
                  description={eth_signTypedData_v4Ret}
                />
              </Space>
            </Card>
          </Col>
          <Permit chainId={chainId} />
        </Row>
        <Row gutter={16}>
          <GetEncryptPublicKey />
        </Row>
      </Space>
    </Card>
  );
}

export default SignMessage;
