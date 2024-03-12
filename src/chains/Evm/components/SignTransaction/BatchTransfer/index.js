import {
  Button, Card, Space, message,
} from 'antd';
import { useContext, useState } from 'react';
import EvmContext from '../../../context';
import { grayAddress, myAddress } from '../../const';

function BatchTransfer() {
  const { account } = useContext(EvmContext);

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = async () => {
    try {
      setTransferLoading(true);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: myAddress,
          value: `0x${(10 ** 19).toString(16)}`,
        }],
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
      const txParams = {
        from: account,
        to: grayAddress,
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
          to: '0xd152f549545093347a162dce210e7293f1452150',
          value: '0x6f05b59d3b20000',
          data: '0xe63d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000002c68af0bb140000',
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
          to: '0xd152f549545093347a162dce210e7293f1452150',
          value: '0x853a0d2313c0000',
          data: '0xe63d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000004000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef500000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000002c68af0bb140000000000000000000000000000000000000000000000000000016345785d8a0000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferBaseTokenWithGrayAddressLoading(false);
    }
  };

  const [
    transferBaseTokenWithMoreGrayAddressLoading,
    setTransferBaseTokenWithMoreGrayAddressLoading,
  ] = useState(false);
  const transferBaseTokenWithMoreGrayAddress = async () => {
    try {
      setTransferBaseTokenWithMoreGrayAddressLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0xd152f549545093347a162dce210e7293f1452150',
          value: '0x9b6e64a8ec60000',
          data: '0xe63d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000005000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef5000000000000000000000000070b31bb9859e88ddb3ac04bc205575992edad3fa0000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000002c68af0bb140000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000016345785d8a0000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferBaseTokenWithMoreGrayAddressLoading(false);
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
          to: '0xd152f549545093347a162dce210e7293f1452150',
          value: '0x0',
          data: '0xc73a2d60000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000030d400000000000000000000000000000000000000000000000000000000000030d40',
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
          to: '0xd152f549545093347a162dce210e7293f1452150',
          value: '0x0',
          data: '0xc73a2d60000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef50000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000030d400000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000186a0',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferTokenWithGrayAddressLoading(false);
    }
  };

  const [
    transferTokenWithMoreGrayAddressLoading,
    setTransferTokenWithMoreGrayAddressLoading,
  ] = useState(false);
  const transferTokenWithMoreGrayAddress = async () => {
    try {
      setTransferTokenWithMoreGrayAddressLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0xd152f549545093347a162dce210e7293f1452150',
          value: '0x0',
          data: '0xc73a2d60000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000fe8dc6394501a35ad1c4833f40f382e55dada4f3000000000000000000000000e5a85089a3da45b5460a59b1d4cf181e01fe7681000000000000000000000000f27b3ba38ea4077423f8edaae0e2c9fedb8fda6d000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef5000000000000000000000000070b31bb9859e88ddb3ac04bc205575992edad3fa000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000030d400000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000186a000000000000000000000000000000000000000000000000000000000000186a0',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferTokenWithMoreGrayAddressLoading(false);
    }
  };

  return (
    <Card direction="vertical" title="批量转账 - 请联系我获取测试私钥">
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
          loading={transferBaseTokenWithMoreGrayAddressLoading}
          onClick={transferBaseTokenWithMoreGrayAddress}
          disabled={!account}
        >
          批量转主币 - 命中多个灰地址
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
        <Button
          block
          loading={transferTokenWithMoreGrayAddressLoading}
          onClick={transferTokenWithMoreGrayAddress}
          disabled={!account}
        >
          批量转出代币 - 命中多个灰地址
        </Button>
      </Space>
    </Card>
  );
}

export default BatchTransfer;
