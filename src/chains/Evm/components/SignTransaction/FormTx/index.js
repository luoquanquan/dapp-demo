import {
  message, Col, Input,
  Radio,
  Form,
} from 'antd';
import {
  Button, Card, Space,
} from 'antd-mobile';
import { useContext, useState } from 'react';
import EvmContext from '../../../context';
import { myEvmAddress } from '../../../const';

const legacy = '0x0';
const eip1559 = '0x2';

const toWei = (gwei) => (gwei ? gwei * 10 ** 9 : '');
const toHex = (num) => (num ? `0x${(+num).toString(16)}` : '');

function FormTx() {
  const [form] = Form.useForm();
  const [type, setType] = useState(eip1559);

  const { account, provider } = useContext(EvmContext);

  const [transferLoading, setTransferLoading] = useState(false);
  const handleSubmit = async () => {
    try {
      setTransferLoading(true);
      const formData = form.getFieldsValue();
      const data = {
        from: account,
        to: myEvmAddress,
        type,
        value: toHex(formData.value),
        data: toHex(formData.data),
        gas: toHex(formData.gasLimit),
      };

      if (type === eip1559) {
        data.maxPriorityFeePerGas = toHex(toWei(formData.maxPriorityFeePerGas));
        data.maxFeePerGas = toHex(toWei(formData.maxFeePerGas));
      } else {
        data.gasPrice = toHex(toWei(formData.gasPrice));
      }

      await provider.request({
        method: 'eth_sendTransaction',
        params: [data],
      });
    } catch (error) {
      console.log;
      message.error(error.message);
    } finally {
      console.log(`Current log: 1 ${Date.now()}`);
      setTransferLoading(false);
    }
  };
  const onValuesChange = (formData) => {
    setType(formData.type);
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="组装交易">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            initialValues={{
              type: eip1559,
              to: myEvmAddress,
              gasPrice: 50,
              maxFeePerGas: 35.00000029,
              maxPriorityFeePerGas: 35,
              gasLimit: 21000,
            }}
          >
            <Form.Item label="to" name="to">
              <Input placeholder="to" />
            </Form.Item>

            <Form.Item label="type" name="type">
              <Radio.Group>
                <Radio.Button value={legacy}>Legacy</Radio.Button>
                <Radio.Button value={eip1559}>EIP 1559</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {
              type === eip1559 ? (
                <>
                  <Form.Item label="maxFeePerGas(Gwei)" name="maxFeePerGas">
                    <Input type="float" min={0} placeholder="maxFeePerGas(Gwei)" />
                  </Form.Item>
                  <Form.Item label="maxPriorityFeePerGas(Gwei)" name="maxPriorityFeePerGas">
                    <Input type="float" min={0} placeholder="maxPriorityFeePerGas(Gwei)" />
                  </Form.Item>
                </>
              ) : (
                <Form.Item label="gasPrice(Gwei)" name="gasPrice">
                  <Input type="float" placeholder="gasPrice(Gwei)" min={0} />
                </Form.Item>
              )
            }

            <Form.Item label="gasLimit" name="gasLimit">
              <Input ype="number" min={0} placeholder="gasLimit" />
            </Form.Item>

            <Form.Item label="value" name="value">
              <Input placeholder="value" />
            </Form.Item>

            <Form.Item label="data" name="data">
              <Input placeholder="data" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="submit"
                disabled={!account}
                loading={transferLoading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </Col>

  );
}

export default FormTx;
