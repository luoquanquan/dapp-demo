import { Col } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import React, { useContext, useState } from 'react';
import EvmContext from '../../../context';
import { myEvmAddress } from '../../../const';
import { toastFail, toastSuccess } from '../../../../../utils/toast';

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
    <Col xs={24} lg={12}>
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
        </Space>
      </Card>
    </Col>
  );
}

export default DemoTx;
