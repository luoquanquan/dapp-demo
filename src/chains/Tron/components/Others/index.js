import { useState } from 'react';
import { Button, Card, Space } from 'antd-mobile';
import { tronUSDTAddress } from '../../const';

function Others({ account }) {
  const [watchAssetLoading, setWatchAssetLoading] = useState(false);
  const watchAsset = async () => {
    setWatchAssetLoading(true);
    if (window.tronLink.ready) {
      tronLink.tronWeb.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'trc20',
          options: {
            address: tronUSDTAddress,
          },
        },
      });
    }
  };

  return (
    <Card title="Others">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!account}
          onClick={watchAsset}
          style={{ marginBottom: 8 }}
          loading={watchAssetLoading}
        >
          wallet_watchAsset
        </Button>
      </Space>
    </Card>

  );
}

export default Others;
