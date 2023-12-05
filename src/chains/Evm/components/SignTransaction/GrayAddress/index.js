import { useContext, useState } from 'react';
import {
  Button, Card, Space, message,
} from 'antd';
import EvmContext from '../../../context';

function GrayAddress() {
  const { account } = useContext(EvmContext);

  const [toGrayLoading, setToGrayLoading] = useState(false);
  const toGray = async () => {
    try {
      setToGrayLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
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
      message.error(error.message);
    } finally {
      setToGrayLoading(false);
    }
  };

  const [projectGrayLoading, setProjectGrayLoading] = useState(false);
  const projectGray = async () => {
    try {
      setProjectGrayLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
      const txParams = {
        from: account,
        to: '0x55d398326f99059ff775485246999027b3197955',
        value: '0',
        data: '0x39509351000000000000000000000000ae8dd22b30f0a88c04dc61b125bed99a397a47c9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      };

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setProjectGrayLoading(false);
    }
  };

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = async () => {
    try {
      setTransferLoading(true);
      const txParams = {
        from: account,
        to: '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
        value: `${(1223421331 * 10 ** 8).toString(16)}`,
      };

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
    } catch (error) {
      message.error(message);
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <Card direction="vertical" title="灰地址 & 转主币">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={toGrayLoading}
          onClick={toGray}
          disabled={!account}
        >
          合约地址为灰地址
        </Button>
        <Button
          block
          loading={projectGrayLoading}
          onClick={projectGray}
          disabled={!account}
        >
          项目方地址为灰地址
        </Button>
        <Button
          block
          loading={transferLoading}
          onClick={transfer}
          disabled={!account}
        >
          转主币(交易)
        </Button>
      </Space>
    </Card>
  );
}

export default GrayAddress;
