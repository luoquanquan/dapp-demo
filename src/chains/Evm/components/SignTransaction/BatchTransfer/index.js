import {
  Button, Card, Col, Space, message,
} from 'antd';
import { useContext, useState } from 'react';
import EvmContext from '../../../context';

function BatchTransfer() {
  const { account } = useContext(EvmContext);

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = async () => {
    try {
      setTransferLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      const txParams = {
        from: account,
        to: '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
        value: `0x${(10 ** 9).toString(16)}`,
      };

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const [transferWithGrayAddressLoading, setTransferWithGrayAddressLoading] = useState(false);
  const transferWithGrayAddress = async () => {
    try {
      setTransferWithGrayAddressLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      const txParams = {
        from: account,
        to: '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
        value: `0x${(10 ** 9).toString(16)}`,
      };

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferWithGrayAddressLoading(false);
    }
  };

  const [transferBaseTokenLoading, setTransferBaseTokenLoading] = useState(false);
  const transferBaseToken = async () => {
    try {
      setTransferBaseTokenLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          value: '0x6f05b59d3b20000',
          to: '0xd152f549545093347a162dce210e7293f1452150',
          data: '0xe63d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000030000000000000000000000003d036df7e027c2b6972aeb891eaa2e97aab24e63000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a14410000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000002c68af0bb140000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferBaseTokenLoading(false);
    }
  };

  const [
    transferBaseTokenWithGrayAddressLoading,
    setTransferBaseTokenWithGrayAddressLoading,
  ] = useState(false);
  const transferBaseTokenWithGrayAddress = async () => {
    try {
      setTransferBaseTokenWithGrayAddressLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          value: '0x6f05b59d3b20000',
          to: '0xd152f549545093347a162dce210e7293f1452150',
          data: '0xe63d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000030000000000000000000000003d036df7e027c2b6972aeb891eaa2e97aab24e63000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef500000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000002c68af0bb140000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferBaseTokenWithGrayAddressLoading(false);
    }
  };

  const [transferTokenLoading, setTransferTokenLoading] = useState(false);
  const transferToken = async () => {
    try {
      setTransferTokenLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          value: '0x0',
          to: '0xd152f549545093347a162dce210e7293f1452150',
          data: '0xc73a2d60000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000020000000000000000000000003d036df7e027c2b6972aeb891eaa2e97aab24e63000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000030d40',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferTokenLoading(false);
    }
  };

  const [
    transferTokenWithGrayAddressLoading, setTransferTokenWithGrayAddressLoading,
  ] = useState(false);
  const transferTokenWithGrayAddress = async () => {
    try {
      setTransferTokenWithGrayAddressLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          value: '0x0',
          to: '0xd152f549545093347a162dce210e7293f1452150',
          data: '0xc73a2d60000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000030000000000000000000000003d036df7e027c2b6972aeb891eaa2e97aab24e63000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef50000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000030d400000000000000000000000000000000000000000000000000000000000030d40',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferTokenWithGrayAddressLoading(false);
    }
  };

  return (
    <Col span={12}>
      <Card direction="vertical" title="批量转账">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            loading={transferLoading}
            onClick={transfer}
            disabled={!account}
          >
            单一转主币
          </Button>
          <Button
            block
            loading={transferWithGrayAddressLoading}
            onClick={transferWithGrayAddress}
            disabled={!account}
          >
            单一转主币 - 命中灰地址
          </Button>
          <Button
            block
            loading={transferBaseTokenLoading}
            onClick={transferBaseToken}
            disabled={!account}
          >
            批量转主币
          </Button>
          <Button
            block
            loading={transferBaseTokenWithGrayAddressLoading}
            onClick={transferBaseTokenWithGrayAddress}
            disabled={!account}
          >
            批量转主币 - 命中灰地址
          </Button>
          <Button
            block
            loading={transferTokenLoading}
            onClick={transferToken}
            disabled={!account}
          >
            批量转代币
          </Button>
          <Button
            block
            loading={transferTokenWithGrayAddressLoading}
            onClick={transferTokenWithGrayAddress}
            disabled={!account}
          >
            批量转出代币 - 命中灰地址
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default BatchTransfer;
