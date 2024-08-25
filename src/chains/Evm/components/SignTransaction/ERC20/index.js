import { ethers } from 'ethers';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Alert,
  Col, Row,
} from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import _ from 'lodash';
import { hstAbi, hstBytecode } from './const';
import EvmContext from '../../../context';
import { toastFail } from '../../../../../utils/toast';
import {
  getEvmBlackContractAddress, getStrongBlackEoaAddress, myAddress, openSeaAddress,
} from '../../../../../utils/const';

const anchorUsedTokens = 'anchorUsedTokens';
const defaultSymbol = 'CIRCLE_LUO';

const usedTokens = [
  {
    chain: 'OKTC',
    symbol: defaultSymbol,
    chainId: 66,
    address: '0x10F40246797E35737E7eDa5DE7741C2Dde5317E0',
  },
  {
    chain: 'OKTC',
    symbol: 'USDT',
    chainId: 66,
    address: '0x382bB369d343125BfB2117af9c149795C6C65C50',
  },
  {
    chain: 'Polygon',
    symbol: defaultSymbol,
    chainId: 137,
    address: '0x6615a6c72b04f8Ec45cd2a3576e403c111623111',
  },
  {
    chain: 'Polygon',
    symbol: 'USDT',
    chainId: 137,
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  {
    chain: 'Polygon',
    symbol: 'QUANQU...QUAN',
    chainId: 137,
    address: '0x6Ed7E67F6ee4833Fd4b461c0ce5F1949c133d4ed',
  },
  {
    chain: 'OKT Test',
    symbol: defaultSymbol,
    chainId: 65,
    address: '0x5Afc8d6a4B154FD1db5E3361049A889fFE22A352',
  },
];

function ERC20() {
  const createTokenRef = useRef();
  const image = `${window.location.origin}${process.env.PUBLIC_URL}/favicon.png`;
  // chain context
  const { account, provider, chainId } = useContext(EvmContext);
  const grayAddress = getEvmBlackContractAddress(chainId);
  const strongBlackAddress = getStrongBlackEoaAddress(chainId);
  const [decimals, setDecimals] = useState(4);
  const [symbol, setSymbol] = useState();

  const [hstContract, setHstContract] = useState({});
  const [notHaveToken, setNotHaveToken] = useState(false);
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenAddress = urlParams.get('tokenAddress');

      if (account && tokenAddress) {
        setNotHaveToken(false);
        setSymbol(undefined);
        setHstContract({});
        setDecimals(4);
        createTokenRef.current?.scrollIntoView({ behavior: 'smooth' });

        const targetToken = usedTokens.find(({ address }) => address === tokenAddress);
        if (targetToken) {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${targetToken.chainId.toString(16)}` }] });
        }

        const newHstContract = new ethers.Contract(
          tokenAddress,
          hstAbi,
          new ethers.providers.Web3Provider(provider, 'any').getSigner(),
        );

        const tokenSymbol = await newHstContract.symbol();
        setSymbol(tokenSymbol);
        const tokenDecimals = await newHstContract.decimals();
        const balance = await newHstContract.balanceOf(account);
        if (balance.eq(0)) {
          setNotHaveToken(true);
        } else {
          setNotHaveToken(false);
        }

        setDecimals(tokenDecimals);
        setHstContract(newHstContract);
      }
    })();
  }, [account, provider]);
  const [createBtnLoading, setCreateBtnLoading] = useState(false);

  const handleCreateToken = async () => {
    try {
      setCreateBtnLoading(true);
      const hstFactory = new ethers.ContractFactory(
        hstAbi,
        hstBytecode,
        new ethers.providers.Web3Provider(provider, 'any').getSigner(),
      );
      const newHstContract = await hstFactory.deploy(
        1000000000000000,
        defaultSymbol,
        decimals,
        defaultSymbol,
      );
      await newHstContract.deployTransaction.wait();
      setHstContract(newHstContract);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setCreateBtnLoading(false);
    }
  };

  const [watchAssetLoading, setWatchAssetLoading] = useState(false);
  const wallet_watchAsset = async () => {
    try {
      setWatchAssetLoading(true);
      await provider.request({
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
      console.log(error);
      toastFail();
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
        `${10 ** decimals}`,
        {
          from: account,
          gasLimit: undefined,
          gas: undefined,
          ...gasInfo,
        },
      );
    } catch (error) {
      console.log(error);
      toastFail();
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
      console.log(error);
      toastFail();
    } finally {
      setApproveTokenLoading(false);
    }
  };

  const [increaseAllowanceLoading, setIncreaseAllowanceLoading] = useState(false);
  const handleIncreaseAllowance = (spender = openSeaAddress) => async () => {
    try {
      setIncreaseAllowanceLoading(true);
      await hstContract.increaseAllowance(
        spender,
        `${100 * 10 ** decimals}`,
        {
          from: account,
        },
      );
    } catch (error) {
      console.log(error);
      toastFail();
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
      console.log(error);
      toastFail();
    } finally {
      setDecreaseAllowance(false);
    }
  };

  return (
    <Col xs={24} lg={12} ref={createTokenRef}>
      <Card
        direction="vertical"
        title={symbol || '--'}
        extra={!hstContract.address && (
          <strong>
            <a href={`#${anchorUsedTokens}`}>Common token</a>
          </strong>
        )}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            type="info"
            message="Contract address"
            description={hstContract.address || ''}
          />
          <Button
            block
            loading={createBtnLoading}
            onClick={handleCreateToken}
            disabled={!account}
          >
            Deploy Contract
          </Button>
          <Button
            block
            loading={watchAssetLoading}
            onClick={wallet_watchAsset}
            disabled={!hstContract.address}
          >
            【EIP 747】Add Token to wallet
          </Button>
          {
            notHaveToken
              ? (
                <Row gutter={12}>
                  <Col xs={24} lg={24}>
                    检测到你的地址没有
                    {symbol}
                    代币
                    {/* <>
                      你可以
                      <Button
                        block
                        style={{ marginBottom: 8 }}
                        loading={approveTokenLoading}
                        onClick={handleApproveToken({})}
                        disabled={!hstContract.address || !account}
                      >
                        mint
                      </Button>
                    </> */}
                  </Col>
                </Row>
              )
              : (
                <Row gutter={12}>
                  <Col xs={24} lg={12}>
                    <Card title="Approve Token">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                          block
                          style={{ marginBottom: 8 }}
                          loading={approveTokenLoading}
                          onClick={handleApproveToken({})}
                          disabled={!hstContract.address || !account}
                        >
                          approve
                        </Button>
                        <Button
                          block
                          color="warning"
                          style={{ marginBottom: 8 }}
                          loading={approveTokenLoading}
                          onClick={handleApproveToken({ spender: myAddress })}
                          disabled={!hstContract.address || !account}
                        >
                          To EOA
                        </Button>
                        <Button
                          block
                          style={{ marginBottom: 8 }}
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
                          revoke
                        </Button>
                        <Button
                          block
                          style={{ marginBottom: 8 }}
                          loading={approveTokenLoading}
                          onClick={handleApproveToken({
                            spender: myAddress,
                            amount: '0',
                          })}
                          disabled={!hstContract.address || !account}
                        >
                          revoke to EOA
                        </Button>
                        <Button
                          block
                          style={{ marginBottom: 8 }}
                          loading={increaseAllowanceLoading}
                          onClick={handleIncreaseAllowance()}
                          disabled={!hstContract.address || !account}
                        >
                          increaseAllowance
                        </Button>
                        <Button
                          block
                          color="warning"
                          style={{ marginBottom: 8 }}
                          loading={increaseAllowanceLoading}
                          onClick={handleIncreaseAllowance(myAddress)}
                          disabled={!hstContract.address || !account}
                        >
                          increaseAllowance to EOA
                        </Button>
                        <Button
                          block
                          style={{ marginBottom: 8 }}
                          loading={decreaseAllowanceLoading}
                          onClick={decreaseAllowance}
                          disabled={!hstContract.address || !account}
                        >
                          decreaseAllowance
                        </Button>
                        {
                          !!grayAddress && (
                            <>
                              <Button
                                block
                                color="danger"
                                style={{ marginBottom: 8 }}
                                loading={approveTokenLoading}
                                onClick={handleApproveToken({ spender: grayAddress })}
                                disabled={!hstContract.address || !account}
                              >
                                To Gray Address
                              </Button>
                              <Button
                                block
                                style={{ marginBottom: 8 }}
                                loading={approveTokenLoading}
                                onClick={handleApproveToken({ spender: grayAddress, amount: '0' })}
                                disabled={!hstContract.address || !account}
                              >
                                revoke Gray Address
                              </Button>
                            </>
                          )
                        }
                        {
                          !!strongBlackAddress && (
                            <>
                              <Button
                                block
                                color="danger"
                                style={{ marginBottom: 8 }}
                                loading={approveTokenLoading}
                                onClick={handleApproveToken({ spender: strongBlackAddress })}
                                disabled={!hstContract.address || !account}
                              >
                                To StrongBlack Address
                              </Button>
                              <Button
                                block
                                style={{ marginBottom: 8 }}
                                loading={approveTokenLoading}
                                onClick={handleApproveToken({ spender: strongBlackAddress, amount: '0' })}
                                disabled={!hstContract.address || !account}
                              >
                                revoke StrongBlack Address
                              </Button>
                            </>
                          )
                        }
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Transfer Token">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                          block
                          style={{ marginBottom: 8 }}
                          loading={transferTokensLoading}
                          onClick={handleTransferToken()}
                          disabled={!hstContract.address || !account}
                        >
                          transfer
                        </Button>
                        {
                          !!grayAddress && (
                            <Button
                              block
                              color="danger"
                              style={{ marginBottom: 8 }}
                              loading={transferTokensLoading}
                              onClick={handleTransferToken(
                                undefined,
                                true,
                                grayAddress,
                              )}
                              disabled={!hstContract.address || !account}
                            >
                              To Black Address
                            </Button>
                          )
                        }
                        {
                          !!strongBlackAddress && (
                            <Button
                              block
                              color="danger"
                              style={{ marginBottom: 8 }}
                              loading={transferTokensLoading}
                              onClick={handleTransferToken(
                                undefined,
                                true,
                                strongBlackAddress,
                              )}
                              disabled={!hstContract.address || !account}
                            >
                              To StrongBlack Address
                            </Button>
                          )
                        }
                      </Space>
                    </Card>
                  </Col>
                </Row>
              )
          }

          <div id={anchorUsedTokens} />
          <Alert
            type="info"
            message="Common token"
            description={
              Object.entries(_.groupBy(usedTokens, 'chain')).map(([chain, data]) => (
                <Row gutter={12} key={chain}>
                  <Col>
                    {chain}
                  </Col>
                  {
                    data.map((token) => (
                      <Col key={token.address}>
                        <a href={`${['luoquanquan.github.io', 'localhost'].includes(window.location.hostname) ? process.env.PUBLIC_URL : ''}/?tokenAddress=${token.address}`}>
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

export default ERC20;
