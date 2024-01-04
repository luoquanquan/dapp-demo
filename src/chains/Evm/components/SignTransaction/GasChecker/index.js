import {
  Button, Card, Space, message,
} from 'antd';
import { useContext, useState } from 'react';
import EvmContext from '../../../context';
import { myAddress } from '../../const';

function GasChecker() {
  const { account } = useContext(EvmContext);

  const [loading, setLoading] = useState(false);
  const checkFn = (gasInfo = {}) => async () => {
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

  const gas = `0x${(21000).toString(16)}`;
  const gasPrice = `0x${(300 * 10 ** 9).toString(16)}`;
  const maxFeePerGas = `0x${(400 * 10 ** 9).toString(16)}`;
  const maxPriorityFeePerGas = `0x${(40 * 10 ** 9).toString(16)}`;

  return (
    <Card direction="vertical" title="Gas Checker - dapp 各种传参">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            gasPrice,
            maxFeePerGas,
            maxPriorityFeePerGas,
          })}
        >
          all
        </Button>
        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            gasPrice,
          })}
        >
          Legacy
        </Button>

        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            maxFeePerGas,
            maxPriorityFeePerGas,
          })}
        >
          1559
        </Button>

        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            gasPrice,
            maxFeePerGas,
          })}
        >
          gasPrice & maxFeePerGas
        </Button>

        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            gasPrice,
            maxPriorityFeePerGas,
          })}
        >
          gasPrice & maxPriorityFeePerGas
        </Button>

        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            maxFeePerGas,
          })}
        >
          maxFeePerGas
        </Button>

        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas,
            maxPriorityFeePerGas,
          })}
        >
          maxPriorityFeePerGas
        </Button>

        <Button
          loading={loading}
          block
          onClick={checkFn({
            gas: `0x${(10).toString(16)}`,
            gasPrice,
            maxFeePerGas,
            maxPriorityFeePerGas,
          })}
        >
          Low gas Limit
        </Button>
      </Space>
    </Card>
  );
}

export default GasChecker;
