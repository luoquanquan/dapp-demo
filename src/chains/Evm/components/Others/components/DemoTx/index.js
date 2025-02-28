import { Button, Card, Space } from 'antd-mobile';
import React, { useContext, useState } from 'react';
import EvmContext from '../../../../context';
import { myEvmAddress } from '../../../../const';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';

function DemoTx() {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useContext(EvmContext);

  const fire = (otherParams, chainId) => async () => {
    try {
      setLoading(true);
      chainId && await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
      const resp = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          to: myEvmAddress,
          from: account,
          ...otherParams,
        }],
      });
      console.log('Current log: resp: ', resp);
      toastSuccess();
    } catch (error) {
      toastFail();
      console.log('Current log: error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card direction="vertical" title="DemoTx">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={loading}
          disabled={!account}
          onClick={fire({
            to: '0xf40cc66dc41f5b95fcb0fd8f1d68105a279aaf15',
            value: '0x02c68af0bb140000',
            data: '0x8d1cbf6700000000000000000000000000000000000000000000000000000000000000010000000000000000000000006d4ad4f6f72f8b7c246616d2f14bc76ed5ce496a0000000000000000000000000000000000000000000000001d24b2dfac52000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000030555143444c554e4b4f615f34714337506d34625931785f6d6533727258514572434a7074794d5033766e535f6d42464400000000000000000000000000000000',
          }, '0x15a9')}
        >
          Duck Chain Demo fire
        </Button>

        <Button
          block
          loading={loading}
          disabled={!account}
          onClick={fire({
            to: '0xd152f549545093347a162dce210e7293f1452150',
            value: '0x6f05b59d3b20000',
            data: '0xe6d3d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000002c68af0bb1400001121',
          }, '0x89')}
        >
          预执行失败
        </Button>

        <Button
          block
          loading={loading}
          disabled={!account}
          onClick={fire({
            to: myEvmAddress,
            value: '0xffffff',
          }, '0x1')}
        >
          gas 不足导致的预执行失败
        </Button>
      </Space>
    </Card>
  );
}

export default DemoTx;
