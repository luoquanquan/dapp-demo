import { ethers } from 'ethers';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Alert,
  Button, Card, Col, Row, Space, Typography,
} from 'antd';
import _ from 'lodash';
import { hstAbi, hstBytecode } from './const';
import EvmContext from '../../../context';
import { grayAddress, myAddress, openSeaAddress } from '../../const';
import toastError from '../../../../../utils/toastError';

const usedTokens = [
  {
    chain: 'OKTC',
    symbol: 'OKX_FE',
    chainId: '0x42',
    address: '0x2bf22a1143f406C2DEb7ECEBfEd26755d1124683',
  },
  {
    chain: 'Polygon',
    symbol: 'OKX_FE',
    chainId: '0x89',
    address: '0x831f4bc8002ec130617e5bf0b401db8a9e4e5204',
  },
  {
    chain: 'Polygon',
    symbol: 'USDT',
    chainId: '0x89',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
];

const anchorUsedTokens = 'anchorUsedTokens';

function CreateToken() {
  const createTokenRef = useRef();
  const image = `${window.location.origin}${process.env.PUBLIC_URL}/favicon.png`;
  // chain context
  const { account, provider } = useContext(EvmContext);
  const [decimals, setDecimals] = useState(4);
  const [symbol, setSymbol] = useState('OKX_FE');

  const [hstContract, setHstContract] = useState({});
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenAddress = urlParams.get('tokenAddress');
      if (account && !hstContract.address && tokenAddress) {
        const targetToken = usedTokens.find(({ address }) => address === tokenAddress);
        if (targetToken) {
          await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetToken.chainId }] });
        }

        const newHstContract = new ethers.Contract(
          tokenAddress,
          hstAbi,
          provider.getSigner(),
        );

        const tokenSymbol = await newHstContract.symbol();
        setSymbol(tokenSymbol);
        const tokenDecimals = await newHstContract.decimals();
        setDecimals(tokenDecimals);
        setHstContract(newHstContract);
        createTokenRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    })();
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
      toastError(error);
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
      toastError(error);
    } finally {
      setWatchAssetLoading(false);
    }
  };

  const [transferTokensLoading, setTransferTokensLoading] = useState(false);
  const handleTransferToken = (
    gasInfo,
    needLoading = true,
    transferTokenTo = myAddress,
  ) => async () => {
    try {
      needLoading && setTransferTokensLoading(true);
      await hstContract.transfer(
        transferTokenTo,
        10 ** decimals,
        {
          from: account,
          gasLimit: undefined,
          gas: undefined,
          ...gasInfo,
        },
      );
    } catch (error) {
      toastError(error);
    } finally {
      setTransferTokensLoading(false);
    }
  };

  const [approveTokenLoading, setApproveTokenLoading] = useState(false);
  const handleApproveToken = ({
    gasInfo,
    needLoading = true,
    // amount = `${100000000000 * 10 ** decimals}`,
    amount = '12222222222123234324324234234324232342',
    spender = openSeaAddress,
  }) => async () => {
    try {
      needLoading && setApproveTokenLoading(true);
      await hstContract.approve(
        spender,
        amount,
        {
          from: account,
          ...gasInfo,
        },
      );
    } catch (error) {
      toastError(error);
    } finally {
      setApproveTokenLoading(false);
    }
  };

  const [increaseAllowanceLoading, setIncreaseAllowanceLoading] = useState(false);
  const handleIncreaseAllowance = async () => {
    try {
      setIncreaseAllowanceLoading(true);
      await hstContract.increaseAllowance(
        openSeaAddress,
        `${100 * 10 ** decimals}`,
        {
          from: account,
        },
      );
    } catch (error) {
      toastError(error);
    } finally {
      setIncreaseAllowanceLoading(false);
    }
  };

  const [decreaseAllowanceLoading, setDecreaseAllowance] = useState(false);
  const decreaseAllowance = async () => {
    try {
      setDecreaseAllowance(true);
      await hstContract.decreaseAllowance(
        openSeaAddress,
        `${100 * 10 ** decimals}`,
        {
          from: account,
        },
      );
    } catch (error) {
      toastError(error);
    } finally {
      setDecreaseAllowance(false);
    }
  };

  return (
    <Col span={12} ref={createTokenRef}>
      <Card
        direction="vertical"
        title={`ERC 20 代币(${symbol})`}
        extra={!hstContract.address && (
        <span>
          <strong>
            <a href={`#${anchorUsedTokens}`}>点击使用常用代币</a>
          </strong>
          或部署合约
        </span>
        )}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            type="info"
            message="合约地址"
            description={hstContract.address || ''}
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
            【EIP 747】添加代币到钱包
          </Button>
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
                            gasPrice: 200 * 10 ** 9,
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
                            maxFeePerGas: 200 * 10 ** 9,
                            maxPriorityFeePerGas: 20 * 10 ** 9,
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
                            maxFeePerGas: 200 * 10 ** 9,
                            maxPriorityFeePerGas: 20 * 10 ** 9,
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
                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({ spender: grayAddress })}
                    disabled={!hstContract.address || !account}
                  >
                    授权给灰地址
                  </Button>
                  <Button
                    block
                    loading={approveTokenLoading}
                    onClick={handleApproveToken({ spender: grayAddress, amount: '0' })}
                    disabled={!hstContract.address || !account}
                  >
                    取消授权给灰地址
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
                  <Button
                    block
                    loading={transferTokensLoading}
                    onClick={handleTransferToken(
                      undefined,
                      true,
                      grayAddress,
                    )}
                    disabled={!hstContract.address || !account}
                  >
                    转代币给灰地址
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
          <div id={anchorUsedTokens} />
          <Alert
            type="info"
            message="常用代币"
            description={
              Object.entries(_.groupBy(usedTokens, 'chain')).map(([chain, data]) => (
                <Row gutter={12} key={chain}>
                  <Col>
                    {chain}
                  </Col>
                  {
                    data.map((token) => (
                      <Col key={token.address}>
                        <a href={`${process.env.PUBLIC_URL}/?tokenAddress=${token.address}`}>
                          {token.symbol}
                        </a>
                      </Col>
                    ))
                  }
                </Row>
              ))
            }
          />
        </Space>
      </Card>
    </Col>
  );
}

export default CreateToken;
