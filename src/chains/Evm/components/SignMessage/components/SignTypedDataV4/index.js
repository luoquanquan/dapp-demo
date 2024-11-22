import { Col, Popover } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import { useContext, useState } from 'react';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import EvmContext from '../../../../context';

function SignTypedDataV4() {
  const { account, chainId, provider } = useContext(EvmContext);

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
      const ret = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setEth_signTypedData_v4Loading(false);
    }
  };

  const eth_signTypedData_v4_0 = async () => {
    // await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
    const msgParams = {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        OrderComponents: [
          {
            name: 'offerer',
            type: 'address',
          },
          {
            name: 'zone',
            type: 'address',
          },
          {
            name: 'offer',
            type: 'OfferItem[]',
          },
          {
            name: 'consideration',
            type: 'ConsiderationItem[]',
          },
          {
            name: 'orderType',
            type: 'uint8',
          },
          {
            name: 'startTime',
            type: 'uint256',
          },
          {
            name: 'endTime',
            type: 'uint256',
          },
          {
            name: 'zoneHash',
            type: 'bytes32',
          },
          {
            name: 'salt',
            type: 'uint256',
          },
          {
            name: 'conduitKey',
            type: 'bytes32',
          },
          {
            name: 'counter',
            type: 'uint256',
          },
        ],
        OfferItem: [
          {
            name: 'itemType',
            type: 'uint8',
          },
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'identifierOrCriteria',
            type: 'uint256',
          },
          {
            name: 'startAmount',
            type: 'uint256',
          },
          {
            name: 'endAmount',
            type: 'uint256',
          },
        ],
        ConsiderationItem: [
          {
            name: 'itemType',
            type: 'uint8',
          },
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'identifierOrCriteria',
            type: 'uint256',
          },
          {
            name: 'startAmount',
            type: 'uint256',
          },
          {
            name: 'endAmount',
            type: 'uint256',
          },
          {
            name: 'recipient',
            type: 'address',
          },
        ],
      },
      primaryType: 'OrderComponents',
      domain: {
        name: 'Seaport',
        version: '1.1',
        chainId: chainId.toString(10),
        verifyingContract: '0x00000000006c3852cbEf3e08E8dF289169EdE581',
      },
      message: {
        offerer: '0x6c8ee01f1f8b62e987b3d18f6f28b22a0ada755f',
        offer: [
          {
            itemType: '2',
            token: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
            identifierOrCriteria: '5547',
            startAmount: '1',
            endAmount: '1',
          },
          {
            itemType: '2',
            token: '0x5Af0D9827E0c53E4799BB226655A1de152A425a5',
            identifierOrCriteria: '5547',
            startAmount: '1',
            endAmount: '1',
          },
        ],
        consideration: [
          {
            itemType: '0',
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '1',
            endAmount: '1',
            recipient: '0x6c8ee01f1f8b62e987b3d18f6f28b22a0ada755f',
          },
          {
            itemType: '0',
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '2475000000000000000',
            endAmount: '2475000000000000000',
            recipient: '0x0000a26b00c1F0DF003000390027140000fAa719',
          },
          {
            itemType: '0',
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '2475000000000000000',
            endAmount: '2475000000000000000',
            recipient: '0xA858DDc0445d8131daC4d1DE01f834ffcbA52Ef1',
          },
        ],
        startTime: '1664436437',
        endTime: '1667028437',
        orderType: '2',
        zone: '0x004C00500000aD104D7DBd00e3ae0A5C00560C00',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '24446860302761739304752683030156737591518664810215442929818054330004503495628',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: '3',
        counter: '53',
      },
    };

    try {
      setEth_signTypedData_v4Loading(true);
      const ret = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setEth_signTypedData_v4Loading(false);
    }
  };

  return (
    <Col xs={24} lg={6}>
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
            onClick={eth_signTypedData_v4({ fakeMsg: true })}
            loading={eth_signTypedData_v4Loading}
          >
            Error Sign Messsage Body
          </Button>
          <Button
            block
            disabled={!account}
            onClick={eth_signTypedData_v4_0}
            loading={eth_signTypedData_v4Loading}
          >
            low value to get NFT
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default SignTypedDataV4;
