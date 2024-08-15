import { useState } from 'react';
import { Button, Card, Space } from 'antd-mobile';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';

function NeedNotConnectWallet() {
  const [addNetLoading, setAddNetLoading] = useState(false);
  const addNet = async () => {
    try {
      setAddNetLoading(true);
      const ret = await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x4268',
            rpcUrls: ['https://rpc.ankr.com/eth_holesky'],
            chainName: 'Holesky',
            nativeCurrency: { name: 'Holesky ETH', decimals: 18, symbol: 'ETH' },
            blockExplorerUrls: ['https://holesky.etherscan.io/'],
          },
        ],
      });

      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setAddNetLoading(false);
    }
  };

  const [wallet_watchAssetLoading, setWallet_watchAssetLoading] = useState(false);
  const wallet_watchAsset = async () => {
    try {
      setWallet_watchAssetLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x42' }] });
      const ret = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0xbecf26d656cd1ab1bfac7edd7e0b6b4d3477092d',
            symbol: 'OKX_FE',
            decimals: 4,
            image: `${window.location.origin}${process.env.PUBLIC_URL}/favicon.png`,
          },
        },
      });

      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setWallet_watchAssetLoading(false);
    }
  };

  return (
    <Card title="need't connect wallet">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={addNetLoading}
          onClick={addNet}
        >
          Add Chain to wallet
        </Button>
        <Button
          block
          loading={wallet_watchAssetLoading}
          onClick={wallet_watchAsset}
        >
          Add Token to wallet
        </Button>
      </Space>
    </Card>
  );
}

export default NeedNotConnectWallet;
