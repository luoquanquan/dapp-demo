import { useContext, useState } from 'react';
import { Button, Card, Space } from 'antd-mobile';

import EvmContext from '../../../../context';
import { myAddress } from '../../../../../../utils/const';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';

function TestForDefaultGas() {
  const { account, provider } = useContext(EvmContext);

  const [addSepoliaTestNetworkLoading, setAddSepoliaTestNetworkLoading] = useState(false);
  const addSepoliaTestNetwork = async () => {
    try {
      setAddSepoliaTestNetworkLoading(true);
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x4268',
            rpcUrls: ['https://rpc.ankr.com/eth_holesky'],
            chainName: 'Holesky Test',
            nativeCurrency: { name: 'Holesky ETH', decimals: 18, symbol: 'ETH' },
            blockExplorerUrls: ['https://holesky.etherscan.io/'],
          },
        ],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setAddSepoliaTestNetworkLoading(false);
    }
  };

  const [addTokenLoading, setAddTokenLoading] = useState(false);
  const addToken = (chainId, tokenAddress) => async () => {
    try {
      setAddTokenLoading(true);
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: 'tokenAddress',
            decimals: 4,
            image: `${window.location.origin}${process.env.PUBLIC_URL}/favicon.png`,
          },
        },
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setAddTokenLoading(false);
    }
  };

  const [sendBaseTokenLoading, setSendBaseTokenLoading] = useState(false);
  const sendBaseToken = (chainId, gasInfo) => async () => {
    try {
      setSendBaseTokenLoading(true);
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
      await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: myAddress,
          value: `0x${(10 ** 15).toString(16)}`,
          ...gasInfo,
        }],
      });
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSendBaseTokenLoading(false);
    }
  };

  return (
    <Card title="Test For Default Gas ~">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!account}
          onClick={addSepoliaTestNetwork}
          loading={addSepoliaTestNetworkLoading}
        >
          Add Holesky Test Network
        </Button>

        <Button
          block
          disabled={!account}
          loading={addTokenLoading}
          onClick={addToken('0x4268', '0x7ad6a7eb39e97f08a7deb05c87496d340e08d54f')}
        >
          Add Holesky Test Network Token
        </Button>

        <Button
          block
          disabled={!account}
          loading={addTokenLoading}
          onClick={addToken('0x41', '0x7ad6a7eb39e97f08a7deb05c87496d340e08d54f')}
        >
          Add OKC Test Network Token
        </Button>

        <Button
          block
          disabled={!account}
          loading={sendBaseTokenLoading}
          onClick={sendBaseToken('0x41', { gasPrice: `0x${(15 * 10 ** 9).toString(16)}`, gas: '0x5208' })}
        >
          Send OKC BaseToken WithGas(Legacy)
        </Button>

        <Button
          block
          disabled={!account}
          loading={sendBaseTokenLoading}
          onClick={sendBaseToken('0x41')}
        >
          Send OKC BaseToken WithoutGas(Legacy)
        </Button>

        <Button
          block
          disabled={!account}
          loading={sendBaseTokenLoading}
          onClick={sendBaseToken('0x4268', { maxFeePerGas: `0x${(2.1 * 10 ** 9).toString(16)}`, maxPriorityFeePerGas: `0x${(2 * 10 ** 9).toString(16)}`, gas: '0x5208' })}
        >
          Send Holesky BaseToken WithGas(eip-1559)
        </Button>

        <Button
          block
          disabled={!account}
          loading={sendBaseTokenLoading}
          onClick={sendBaseToken('0x4268')}
        >
          Send Holesky BaseToken WithoutGas(eip-1559)
        </Button>

      </Space>
    </Card>
  );
}

export default TestForDefaultGas;
