import {
  Button,
  Card, Col, Row, Space, message,
} from 'antd';
import { useState } from 'react';

function Others() {
  const [addNetLoading, setAddNetLoading] = useState(false);
  const addNet = async () => {
    try {
      setAddNetLoading(true);
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x52',
            rpcUrls: ['https://rpc-meter.jellypool.xyz'],
            chainName: 'Meter Mainnet',
            nativeCurrency: { name: 'MTR', decimals: 18, symbol: 'TEST' },
            blockExplorerUrls: ['https://scan.meter.io'],
          },
        ],
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setAddNetLoading(false);
    }
  };

  const [wallet_watchAssetLoading, setWallet_watchAssetLoading] = useState(false);
  const wallet_watchAsset = async () => {
    try {
      setWallet_watchAssetLoading(true);
      await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x42' }] });
      await ethereum.request({
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
    } catch (error) {
      message.error(error.message);
    } finally {
      setWallet_watchAssetLoading(false);
    }
  };

  return (
    <Card title="其他">
      <Row gutter={12}>
        <Col span={12}>
          <Card title="无需连接钱包即可进行的操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                loading={addNetLoading}
                onClick={addNet}
              >
                添加网络
              </Button>
              <Button
                block
                loading={wallet_watchAssetLoading}
                onClick={wallet_watchAsset}
              >
                添加代币(OKT 链测试代币)
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default Others;
