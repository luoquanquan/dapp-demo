/* eslint-disable no-unused-vars */
import {
  message, Col,
} from 'antd';
import {
  Button, Card, Input, Space,
  Switch,
} from 'antd-mobile';
import { useContext, useState } from 'react';
import { add } from 'lodash';
import EvmContext from '../../../context';
import { myAddress } from '../../../../../utils/const';

function Form() {
  const { account } = useContext(EvmContext);
  const [baseFeePerGas, setBaseFeePerGas] = useState('');
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [gasLimit, setGasLimit] = useState(21000);
  const [isEip1559, setIsEip1559] = useState(false);

  const toHex = (num) => `0x${(+num).toString(16)}`;

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = async () => {
    try {
      setTransferLoading(true);

      const data = {
        from: account,
        to: myAddress,
        value: `0x${(10 ** 16).toString(16)}`,
        gas: toHex(gasLimit),
      };

      if (isEip1559) {
        data.maxFeePerGas = toHex((+baseFeePerGas + +maxPriorityFeePerGas) * 10 ** 9);
        data.maxPriorityFeePerGas = toHex(maxPriorityFeePerGas * 10 ** 9);
      } else {
        data.gasPrice = toHex(gasPrice * 10 ** 9);
      }

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [data],
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="组装交易">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Switch
            checkedText="Eip 1559"
            uncheckedText="Legacy"
            checked={isEip1559}
            onChange={() => setIsEip1559((p) => !p)}
          />
          {
            isEip1559 ? (
              <>
                <Input placeholder="基础费(Gwei)" type="number" min={0} value={baseFeePerGas} onChange={setBaseFeePerGas} />
                <Input placeholder="小费(Gwei)" type="number" min={0} value={maxPriorityFeePerGas} onChange={setMaxPriorityFeePerGas} />
              </>
            ) : <Input placeholder="gasPrice(Gwei)" type="number" min={0} value={gasPrice} onChange={setGasPrice} />
          }
          <Input placeholder="gasLimit" type="number" min={0} value={gasLimit} onChange={setGasLimit} />
          <Button
            block
            loading={transferLoading}
            onClick={transfer}
            disabled={!account}
          >
            submit
          </Button>
        </Space>
      </Card>
    </Col>

  );
}

export default Form;
