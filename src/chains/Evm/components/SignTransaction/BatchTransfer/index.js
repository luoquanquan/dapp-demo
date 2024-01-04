import {
  Alert,
  Button, Card, Space, message,
} from 'antd';
import { useContext, useState } from 'react';
import EvmContext from '../../../context';
import { grayAddress } from '../../const';
import toastError from '../../../../../utils/toastError';

function BatchTransfer() {
  const { account } = useContext(EvmContext);

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = async () => {
    try {
      setTransferLoading(true);
      // await ethereum.request({ method: 'wallet_switchEthereumChain',
      // params: [{ chainId: '0x89' }] });

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
          value: `0x${(10 ** 9).toString(16)}`,
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
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
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
          value: '0x2aa1efb94e0000',
          to: '0xd152f549545093347a162dce210e7293f1452150',
          data: '0xe63d38ed000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef5000000000000000000000000070b31bb9859e88ddb3ac04bc205575992edad3fa000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000038d7ea4c68000000000000000000000000000000000000000000000000000002386f26fc10000',
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
          value: '0x0',
          to: '0xd152f549545093347a162dce210e7293f1452150',
          data: '0xc73a2d60000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000aaa1634d669dd8aa275bad6fdf19c7e3b2f1ef5000000000000000000000000070b31bb9859e88ddb3ac04bc205575992edad3fa000000000000000000000000b2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000002710',
        }],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferTokenWithMoreGrayAddressLoading(false);
    }
  };

  const [testMulLoading, setTestMulLoading] = useState(false);
  const testMul = async () => {
    try {
      setTestMulLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] });
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          value: '0x844378c6a101336',
          gas: '0x7ea3a',
          to: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
          data: '0xac9650d800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000164883164560000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f00000000000000000000000000000000000000000000000000000000000001f4fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbca62fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbca760000000000000000000000000000000000000000000000000844378c6a10133600000000000000000000000000000000000000000000000000000000000c3500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009d8ccdaf68a4705f33accce0b0ca5804c97eae5700000000000000000000000000000000000000000000000000000000658d3d9500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000412210e8a00000000000000000000000000000000000000000000000000000000',
        }],
      });
    } catch (error) {
      toastError(error);
    } finally {
      setTestMulLoading(false);
    }
  };

  return (
    <Card direction="vertical" title="批量转账 - 不要确认, 不要确认, 不要确认">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert message={(
          <div>
            请导入 evm 系私钥钱包:
            <br />
            0xef524361383a3527066f19fcecfcaf0ec98507431b5094bd1cdd9df21e46877d
            <br />
            进行测试
          </div>
        )}
        />
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
        <Button
          block
          loading={testMulLoading}
          onClick={testMul}
          disabled={!account}
        >
          复杂交互
        </Button>
      </Space>
    </Card>
  );
}

export default BatchTransfer;
