import { useContext, useState } from 'react';
import {
  Button, Card, Col, Space, message,
} from 'antd';
import EvmContext from '../../../context';

function GrayAddress() {
  const { account } = useContext(EvmContext);

  const [txWithGrayAddressLoading, setTxWithGrayAddressLoading] = useState(false);
  const txWithGrayAddress = async () => {
    try {
      setTxWithGrayAddressLoading(true);
      const txParams = {
        from: account,
        to: '0xaaA1634D669dd8aa275BAD6FdF19c7E3B2f1eF50',
        value: '1',
      };

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
    } catch (error) {
      message.error(message);
    } finally {
      setTxWithGrayAddressLoading(false);
    }
  };

  return (
    <Col span={12}>
      <Card direction="vertical" title="灰地址">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            loading={txWithGrayAddressLoading}
            onClick={txWithGrayAddress}
            disabled={!account}
          >
            触发灰地址交互
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default GrayAddress;
