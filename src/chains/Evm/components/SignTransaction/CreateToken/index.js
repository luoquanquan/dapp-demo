import { ethers } from 'ethers';
import { useContext, useState } from 'react';

import {
  Alert,
  Button, Card, Col, Input, Row, Space, message,
} from 'antd';
import { hstAbi, hstBytecode } from './const';
import EvmContext from '../../../context';

const symbol = `OKX_FE-${Math.random().toString(16).slice(2)}`;
function CreateToken() {
  // constant
  const decimals = 4;
  const image = `${window.location.href}favicon.png`;

  // chain context
  const { account, provider } = useContext(EvmContext);

  const [hstContract, setHstContract] = useState({});
  const [createBtnLoading, setCreateBtnLoading] = useState(false);
  const handleCreateToken = async () => {
    try {
      setCreateBtnLoading(true);
      const hstFactory = new ethers.ContractFactory(
        hstAbi,
        hstBytecode,
        provider.getSigner(),
      );
      const resp = await hstFactory.deploy(
        1000,
        symbol,
        decimals,
        symbol,
      );
      await resp.deployTransaction.wait();
      setHstContract(resp);
    } catch (error) {
      message.error('用户拒绝');
    } finally {
      setCreateBtnLoading(false);
    }
  };

  const [watchAssetLoading, setWatchAssetLoading] = useState(false);
  const wallet_watchAsset = async () => {
    try {
      setWatchAssetLoading(true);
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: hstContract.address,
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

  const myAddress = '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446';
  const [transferTokensLoading, setTransferTokensLoading] = useState(false);
  const [transferTokenTo, setTransferTokenTo] = useState(myAddress);
  const checkToAddress = () => {
    if (!(transferTokenTo.startsWith('0x') && transferTokenTo.length === 42)) {
      throw new Error('请输入合法的收款地址');
    }
  };
  const handleTransferToken = (gasInfo, needLoading = true) => async () => {
    try {
      checkToAddress();
      needLoading && setTransferTokensLoading(true);
      await hstContract.transfer(
        transferTokenTo,
        10 ** decimals,
        {
          from: account,
          ...gasInfo,
        },
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setTransferTokensLoading(false);
    }
  };

  const [approveTokenLoading, setApproveTokenLoading] = useState(false);
  const handleApproveToken = ({ gasInfo, needLoading = true, amount = `${100 * 10 ** decimals}` }) => async () => {
    try {
      needLoading && setApproveTokenLoading(true);
      await hstContract.approve(
        myAddress,
        amount,
        {
          from: account,
          ...gasInfo,
        },
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setApproveTokenLoading(false);
    }
  };

  const [increaseAllowanceLoading, setIncreaseAllowanceLoading] = useState(false);
  const handleIncreaseAllowance = async () => {
    try {
      setIncreaseAllowanceLoading(true);
      await hstContract.increaseAllowance(
        // '0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4',
        myAddress,
        `${100 * 10 ** decimals}`,
        {
          from: account,
          gasLimit: 60000,
          gasPrice: '20000000000',
        },
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setIncreaseAllowanceLoading(false);
    }
  };
  return (
    <Col span={12}>
      <Card direction="vertical" title={`ERC 20 代币(${symbol})`}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            type="info"
            message="代币地址"
            description={hstContract.address}
          />
          <Button
            block
            loading={createBtnLoading}
            onClick={handleCreateToken}
            disabled={!account}
          >
            合约部署
          </Button>
          <Button
            block
            loading={watchAssetLoading}
            onClick={wallet_watchAsset}
            disabled={!hstContract.address}
          >
            添加代币到钱包
          </Button>
          <Input
            value={transferTokenTo}
            placeholder="请输入收款地址"
            disabled={!hstContract.address}
            onChange={({ target: { value } }) => {
              setTransferTokenTo(value);
            }}
          />
          <Row gutter={12}>
            <Col span={12}>
              <Card title="授权代币">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({
                      gasInfo: {
                        gasLimit: 60000,
                        gasPrice: '20000000000',
                      },
                    })}
                    disabled={!hstContract.address}
                  >
                    授权(传 gas)
                  </Button>
                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({
                      gasInfo: {
                        gasLimit: 100,
                        gasPrice: '200',
                      },
                      needLoading: false,
                    })}
                    disabled={!hstContract.address}
                  >
                    授权(传极低的 gas)
                  </Button>
                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({})}
                    disabled={!hstContract.address}
                  >
                    授权(不传 Gas)
                  </Button>
                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({
                      gasInfo: {
                        gasLimit: 60000,
                        gasPrice: '20000000000',
                      },
                      amount: '0',
                    })}
                    disabled={!hstContract.address}
                  >
                    取消授权
                  </Button>
                  <Button
                    block
                    loading={increaseAllowanceLoading}
                    onClick={handleIncreaseAllowance}
                    disabled={!hstContract.address}
                  >
                    IncreaseAllowance
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="转移代币">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    block
                    loading={transferTokensLoading}
                    onClick={handleTransferToken({
                      gasLimit: 60000,
                      gasPrice: '20000000000',
                    })}
                    disabled={!hstContract.address}
                  >
                    dapp 传 gas
                  </Button>
                  <Button
                    block
                    loading={transferTokensLoading}
                    onClick={handleTransferToken({
                      gasLimit: 100,
                      gasPrice: '200',
                    }, false)}
                    disabled={!hstContract.address}
                  >
                    dapp 传极低的 gas
                  </Button>
                  <Button
                    block
                    loading={transferTokensLoading}
                    onClick={handleTransferToken()}
                    disabled={!hstContract.address}
                  >
                    dapp 不传 gas
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </Card>
    </Col>
  );
}

export default CreateToken;
