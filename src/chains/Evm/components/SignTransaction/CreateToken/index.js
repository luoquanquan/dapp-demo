import { ethers } from 'ethers';
import {
  useContext, useEffect, useRef, useState,
} from 'react';

import {
  Alert,
  Button, Card, Col, Input, Row, Space, Typography, message,
} from 'antd';
import { hstAbi, hstBytecode } from './const';
import EvmContext from '../../../context';

const usedTokens = [
  {
    chain: 'OKTC',
    symbol: 'OKX_FE',
    chainId: '0x41',
    address: '0xbecf26d656cd1ab1bfac7edd7e0b6b4d3477092d',
  },
  {
    chain: 'Polygon',
    symbol: 'OKX_FE',
    chainId: '0x89',
    address: '0xDf08549478dC76f2208F2D2bE30630068676b554',
  },
  {
    chain: 'Polygon',
    symbol: 'USDT',
    chainId: '0x89',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
];

const symbol = 'OKX_FE';
function CreateToken() {
  // constant
  const decimals = 4;
  const image = `${window.location.href.split('?')[0]}favicon.png`;

  const createTokenRef = useRef();

  // chain context
  const { account, provider } = useContext(EvmContext);

  const [hstContract, setHstContract] = useState({});
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenAddress = urlParams.get('tokenAddress');
    if (account && !hstContract.address && tokenAddress) {
      const targetToken = usedTokens.find(({ address }) => address === tokenAddress);
      if (targetToken) {
        ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetToken.chainId }] });
      }

      const newHstContract = new ethers.Contract(
        tokenAddress,
        hstAbi,
        provider.getSigner(),
      );
      setHstContract(newHstContract);
      createTokenRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [account]);
  const [createBtnLoading, setCreateBtnLoading] = useState(false);

  const handleCreateToken = async () => {
    try {
      setCreateBtnLoading(true);
      const hstFactory = new ethers.ContractFactory(
        hstAbi,
        hstBytecode,
        provider.getSigner(),
      );
      const newHstContract = await hstFactory.deploy(
        1000,
        symbol,
        decimals,
        symbol,
      );
      await newHstContract.deployTransaction.wait();
      setHstContract(newHstContract);
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
        myAddress,
        10 ** decimals,
        {
          from: account,
          ...gasInfo,
        },
      );
    } catch (error) {
      message.error(error?.error?.message || error.message);
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

  const [decreaseAllowanceLoading, setDecreaseAllowance] = useState(false);
  const decreaseAllowance = async () => {
    try {
      setDecreaseAllowance(true);
      await hstContract.decreaseAllowance(
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
      setDecreaseAllowance(false);
    }
  };

  return (
    <Col span={12} ref={createTokenRef}>
      <Card
        direction="vertical"
        title={`ERC 20 代币(${symbol})`}
        extra={hstContract.address || <a href={`/?tokenAddress=${usedTokens[0].address}`}>使用已有代币</a>}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
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
            【EIP 747】添加代币到钱包
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
                  <Typography.Title level={5}>授权传 gas</Typography.Title>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Button
                        block
                        loading={approveTokenLoading}
                        onClick={handleApproveToken({
                          gasInfo: {
                            gasLimit: 60000,
                            gasPrice: '20000000000',
                          },
                        })}
                        disabled={!hstContract.address || !account}
                      >
                        Legacy
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        block
                        loading={approveTokenLoading}
                        onClick={handleApproveToken({
                          gasInfo: {
                            gasLimit: 60000,
                            maxFeePerGas: '20000000000000',
                            maxPriorityFeePerGas: '20000000000',
                          },
                        })}
                        disabled={!hstContract.address || !account}
                      >
                        1559
                      </Button>
                    </Col>
                  </Row>

                  <Typography.Title level={5}>授权传低 gas</Typography.Title>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Button
                        block
                        loading={approveTokenLoading}
                        onClick={handleApproveToken({
                          gasInfo: {
                            gasLimit: 100,
                            gasPrice: '200',
                          },
                        })}
                        disabled={!hstContract.address || !account}
                      >
                        Legacy
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        block
                        loading={approveTokenLoading}
                        onClick={handleApproveToken({
                          gasInfo: {
                            gasLimit: 100,
                            maxFeePerGas: '10721833933800',
                            maxPriorityFeePerGas: '107218339338',
                          },
                        })}
                        disabled={!hstContract.address || !account}
                      >
                        1559
                      </Button>
                    </Col>
                  </Row>

                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({})}
                    disabled={!hstContract.address || !account}
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
                    disabled={!hstContract.address || !account}
                  >
                    取消授权
                  </Button>
                  <Button
                    block
                    loading={increaseAllowanceLoading}
                    onClick={handleIncreaseAllowance}
                    disabled={!hstContract.address || !account}
                  >
                    IncreaseAllowance
                  </Button>
                  <Button
                    block
                    loading={decreaseAllowanceLoading}
                    onClick={decreaseAllowance}
                    disabled={!hstContract.address || !account}
                  >
                    decreaseAllowance
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
                    disabled={!hstContract.address || !account}
                  >
                    转代币(传 gas)
                  </Button>
                  <Button
                    block
                    loading={transferTokensLoading}
                    onClick={handleTransferToken({
                      gasLimit: 100,
                      gasPrice: '200',
                    }, false)}
                    disabled={!hstContract.address || !account}
                  >
                    转代币(低 gas)
                  </Button>
                  <Button
                    block
                    loading={transferTokensLoading}
                    onClick={handleTransferToken()}
                    disabled={!hstContract.address || !account}
                  >
                    转代币(不传 gas)
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
          <Alert
            type="info"
            message="常用代币"
            description={usedTokens.map((token) => (
              // eslint-disable-next-line react/jsx-one-expression-per-line
              <p><a href={`/?tokenAddress=${token.address}`}>{token.chain}: {token.symbol}</a></p>
            ))}
          />
        </Space>
      </Card>
    </Col>
  );
}

export default CreateToken;
