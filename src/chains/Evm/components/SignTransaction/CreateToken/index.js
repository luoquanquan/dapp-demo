import { ethers } from 'ethers';
import { useContext, useState } from 'react';

import {
  Alert,
  Button, Card, Col, Space, message,
} from 'antd';
import { hstAbi, hstBytecode } from './const';
import EvmContext from '../../../context';

function CreateToken() {
  // constant
  const decimals = 4;
  const symbol = 'OKX_FE';
  const image = `${window.location.href}favicon.png`;

  // chain context
  const { account, provider } = useContext(EvmContext);

  const [address, setAddress] = useState('');
  const [createBtnLoading, setCreateBtnLoading] = useState(false);
  const handleCreateToken = async () => {
    try {
      setCreateBtnLoading(true);
      const hstFactory = new ethers.ContractFactory(
        hstAbi,
        hstBytecode,
        provider.getSigner(),
      );
      const hstContract = await hstFactory.deploy(
        1000,
        symbol,
        decimals,
        symbol,
      );
      await hstContract.deployTransaction.wait();
      setAddress(hstContract.address);
    } catch (error) {
      message.error('用户拒绝');
    } finally {
      setCreateBtnLoading(false);
    }
  };

  const [watchAssetLoading, setWatchAssetLoading] = useState(false);
  const handleWallet_watchAsset = async () => {
    try {
      setWatchAssetLoading(true);
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address,
            symbol,
            decimals,
            image,
          },
        },
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setWatchAssetLoading(false);
    }
  };

  return (
    <Col span={8}>
      <Card direction="vertical" title="Eth Sign">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            type="info"
            message="代币地址"
            description={address}
          />
          <Button
            block
            loading={createBtnLoading}
            onClick={handleCreateToken}
            disabled={!account}
          >
            部署代币
          </Button>
          <Button
            block
            loading={watchAssetLoading}
            onClick={handleWallet_watchAsset}
            disabled={!address}
          >
            添加代币到钱包
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default CreateToken;
