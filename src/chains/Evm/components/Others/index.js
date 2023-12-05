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
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0x0833c935956A43fde5095d9302b35752FDA441aC',
            symbol: 'OKX_FE-f4fbefcee985f',
            decimals: 4,
            image: 'http://localhost:3000/favicon.png',
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
                添加网络(仅用于测试添加网络, 目标网络不可用)
              </Button>
              <Button
                block
                loading={wallet_watchAssetLoading}
                onClick={wallet_watchAsset}
              >
                添加代币(测试网需要先部署代币再添加, 此入口不可用)
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default Others;
