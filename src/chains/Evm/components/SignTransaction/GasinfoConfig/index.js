import {
  Button, Card, Space, message, Typography, Input,
} from 'antd';
import { useContext, useState } from 'react';
import EvmContext from '../../../context';
import { myAddress } from '../../const';

function GasChecker() {
  const { account } = useContext(EvmContext);

  const [loading, setLoading] = useState(false);

  const [gasLimit, setGasLimit] = useState('21000');
  const [gasPrice, setGasPrice] = useState((3 * 10 ** 8));
  const [maxFeePerGas, setMaxFeePerGas] = useState((10 * 10 ** 9));
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState((1 * 10 ** 8));

  const checkFn = (gasInfo = {}) => async () => {
    console.log('gasLimit:', gasLimit);

    console.log('gasInfo:', gasInfo);
    try {
      setLoading(true);
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: myAddress,
          value: `0x${(10 ** 9).toString(16)}`,
          ...gasInfo,
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const gas = `0x${(21000).toString(16)}`;
  // const gasPrice = `0x${(300 * 10 ** 9).toString(16)}`;
  // const maxFeePerGas = `0x${(400 * 10 ** 9).toString(16)}`;
  // const maxPriorityFeePerGas = `0x${(40 * 10 ** 9).toString(16)}`;

  return (
    <Card direction="vertical" title="自定义 gas dapp 各种传参">
      <Space direction="vertical" style={{ width: '100%' }}>

        <div>
          <Typography.Title level={5}>gasLimit</Typography.Title>
          <Input
            defaultValue="21000"
            onChange={(e) => {
              setGasLimit(e.target.value);
            }}
          />
        </div>

        <div>
          <Typography.Title level={5}>gasPrice</Typography.Title>
          <Input
            defaultValue={`${(3 * 10 ** 8)}`}
            onChange={(e) => {
              setGasPrice(e.target.value);
            }}
          />
        </div>

        <div>
          <Typography.Title level={5}>maxFeePerGas</Typography.Title>
          <Input
            defaultValue={`${(10 * 10 ** 9)}`}
            onChange={(e) => {
              setMaxFeePerGas(e.target.value);
            }}
          />
        </div>

        <div>
          <Typography.Title level={5}>maxPriorityFeePerGas</Typography.Title>
          <Input
            defaultValue={`${(1 * 10 ** 8)}`}
            onChange={(e) => {
              setMaxPriorityFeePerGas(e.target.value);
            }}
          />
        </div>

        <Button
          loading={loading}
          block
          onClick={

            checkFn({
              gas: `0x${(gasLimit).toString(16)}`,
              gasPrice: `0x${(gasPrice).toString(16)}`,
              maxFeePerGas: `0x${(maxFeePerGas).toString(16)}`,
              maxPriorityFeePerGas: `0x${(maxPriorityFeePerGas).toString(16)}`,
            })
}
        >
          发起dapp交互
        </Button>
      </Space>
    </Card>
  );
}

export default GasChecker;
