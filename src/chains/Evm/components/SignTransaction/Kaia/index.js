import { Col } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import React, { useContext, useState } from 'react';
import { TxType } from '@kaiachain/ethers-ext';
import EvmContext from '../../../context';
import { myEvmAddress } from '../../../const';
import { toastFail, toastSuccess } from '../../../../../utils/toast';

const chainIdHex = '0x2019';

function Kaia() {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useContext(EvmContext);

  const transfer = (otherParams) => async () => {
    try {
      setLoading(true);
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainIdHex }] });
      const resp = await provider.request({
        method: 'kaia_signTransaction',
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
      <Card direction="vertical" title="Kaia">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            loading={loading}
            onClick={transfer({ typeInt: TxType.ValueTransfer, value: `0x${(10 ** 10).toString(16)}` })}
            disabled={!account}
          >
            ValueTransfer
          </Button>

          <Button
            block
            loading={loading}
            onClick={transfer({ typeInt: TxType.FeeDelegatedValueTransfer, feePayer: account, value: `0x${(10 ** 10).toString(16)}` })}
            disabled={!account}
          >
            FeeDelegatedValueTransfer
          </Button>

          <Button
            block
            loading={loading}
            onClick={transfer({
              typeInt: TxType.FeeDelegatedValueTransferMemo, feePayer: account, value: `0x${(10 ** 10).toString(16)}`, data: '0x1',
            })}
            disabled={!account}
          >
            FeeDelegatedValueTransferMemo
          </Button>

          <Button
            block
            loading={loading}
            onClick={transfer({
              typeInt: TxType.FeeDelegatedSmartContractExecution, feePayer: account, to: '0x831f4bC8002Ec130617e5bf0B401DB8a9E4E5204', data: '0x095ea7b30000000000000000000000005c13e303a62fc5dedf5b52d66873f2e59fedadc2ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            })}
            disabled={!account}
          >
            FeeDelegatedSmartContractExecution
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default Kaia;
