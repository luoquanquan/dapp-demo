import {
  Button, Card, Space,
} from 'antd-mobile';
import {
  Col, Row,
} from 'antd';

import { useContext, useState } from 'react';
import GetEncryptPublicKey from './components/GetEncryptPublicKey';
import Permit from './components/Permit';
import EvmContext from '../../context';
import { toastFail, toastSuccess } from '../../../../utils/toast';
import SignTypedDataV4 from './components/SignTypedDataV4';

function SignMessage() {
  const { account, chainId, provider } = useContext(EvmContext);
  const [eth_signLoading, setEth_signLoading] = useState(false);
  const eth_sign = async () => {
    try {
      setEth_signLoading(true);
      // const msg = 'hello world';
      // const hashMsg = '0x' +
      // keccak256(`\x19Ethereum Signed Message:\n${msg.length}${msg}`).toString('hex');
      const hashMsg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ret = await provider.request({
        method: 'eth_sign',
        params: [account, hashMsg],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setEth_signLoading(false);
    }
  };

  const [personal_signLoading, setPersonal_signLoading] = useState(false);
  const handlePersonalSign = (msg = 'Example `personal_sign` message') => async () => {
    try {
      setPersonal_signLoading(true);
      const ret = await provider.request({
        method: 'personal_sign',
        params: [msg, account, 'Example password'],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setPersonal_signLoading(false);
    }
  };

  const [typedDataSignLoading, setTypedDataSignLoading] = useState(false);
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
      const ret = await provider.request({
        method: 'eth_signTypedData',
        params: [typedDataMsg, account],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setTypedDataSignLoading(false);
    }
  };

  const [eth_signTypedData_v3Loading, setEth_signTypedData_v3Loading] = useState(false);
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
      const ret = await provider.request({
        method: 'eth_signTypedData_v3',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setEth_signTypedData_v3Loading(false);
    }
  };

  return (
    <Card title="signMessage">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col xs={24} lg={8}>
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
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
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
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card direction="vertical" title="Sign Typed Data">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  disabled={!account}
                  loading={typedDataSignLoading}
                  onClick={handleTypedDataSign}
                >
                  eth_signTypedData_v1
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24} lg={6}>
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
              </Space>
            </Card>
          </Col>

          <SignTypedDataV4 account={account} />

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
