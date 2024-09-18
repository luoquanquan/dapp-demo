import {
  message, Col, Input,
  Radio,
  Form,
} from 'antd';
import {
  Button, Card, Space,
} from 'antd-mobile';
import { useContext, useMemo, useState } from 'react';
import EvmContext from '../../../context';
import { myAddress } from '../../../../../utils/const';

const initType = 'eip1559';

function FormTx() {
  const [form] = Form.useForm();
  const [type, setType] = useState(initType);

  const { account, provider } = useContext(EvmContext);

  const toHex = (num) => `0x${(+num).toString(16)}`;

  const [transferLoading, setTransferLoading] = useState(false);
  const handleSubmit = async () => {
    const formData = form.getFieldsValue();
    console.log('Current log: formData: ', formData);
    try {
      setTransferLoading(true);

      // const data = {
      //   from: account,
      //   to: myAddress,
      //   value: `0x${(10 ** 16).toString(16)}`,
      //   gas: toHex(gasLimit),
      // };

      // if (isEip1559) {
      //   data.maxFeePerGas = toHex((+baseFeePerGas + +maxPriorityFeePerGas) * 10 ** 9);
      //   data.maxPriorityFeePerGas = toHex(maxPriorityFeePerGas * 10 ** 9);
      // } else {
      //   data.gasPrice = toHex(gasPrice * 10 ** 9);
      // }

      // await provider.request({
      //   method: 'eth_sendTransaction',
      //   params: [data],
      // });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      console.log(`Current log: 1 ${Date.now()}`);
      setTransferLoading(false);
    }
  };
  const onValuesChange = (formData) => {
    setType(formData.type);
  };

  const confirmDisabled = useMemo(() => {
    if (!account) {
      return true;
    }

    const {
 to, type, gasLimit, gasPrice, baseFeePerGas, maxPriorityFeePerGas
} = form.getFieldsValue();
    if (!to || !gasLimit) {
      return true;
    }
 [form]);

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
              type: initType,
              to: myAddress,
            }}
          >
            <Form.Item label="to" name="to">
              <Input placeholder="to" />
            </Form.Item>

            <Form.Item label="type" name="type">
              <Radio.Group>
                <Radio.Button value="legacy">Legacy</Radio.Button>
                <Radio.Button value="eip1559">EIP 1559</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {
              type === 'eip1559' ? (
                <>
                  <Form.Item label="baseFeePerGas(Gwei)" name="baseFeePerGas">
                    <Input placeholder="baseFeePerGas(Gwei)" />
                  </Form.Item>
                  <Form.Item label="maxPriorityFeePerGas(Gwei)" name="gasPrice">
                    <Input placeholder="maxPriorityFeePerGas(Gwei)" />
                  </Form.Item>
                </>
              ) : (
                <Form.Item label="gasPrice(Gwei)" name="gasPrice">
                  <Input placeholder="gasPrice(Gwei)" min={0} />
                </Form.Item>
              )
            }

            <Form.Item label="gasLimit" name="gasLimit">
              <Input placeholder="gasLimit" />
            </Form.Item>

            <Form.Item label="value" name="value">
              <Input placeholder="value" />
            </Form.Item>

            <Form.Item label="data" name="data">
              <Input placeholder="data" />
            </Form.Item>

            <Form.Item label="data" name="data">
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
