import {
  Row, Col,
} from 'antd';
import { Card, Button } from 'antd-mobile';
import { useContext, useState } from 'react';
import dayjs from 'dayjs';
import { sample } from 'lodash';
import EvmContext from '../../../../context';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import { getEvmBlackContractAddress, getStrongBlackEoaAddress, myEvmAddress } from '../../../../const';

const supportedChainIds = [
  '1',
  '137',
  '11155111',
  '314',
];

const chainTokens = {
  1: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    '0x75231f58b43240c9718dd58b4967c5114342a86c',
  ],
  137: [
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    '0xac51c4c48dc3116487ed4bc16542e27b5694da1b',
    '0x0000000000000000000000000000000000001010',
    '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    '0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b',
  ],
  11155111: [
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    '0xac51c4c48dc3116487ed4bc16542e27b5694da1b',
    '0x0000000000000000000000000000000000001010',
    '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    '0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b',
  ],
  314: [
    '0x7b90337f65faa2b2b8ed583ba1ba6eb0c9d7ea44',
    '0x8460766edc62b525fc1fa4d628fc79229dc73031',
    '0xba5cd7ef1414c33e3a250fb89ad7c8f49844762d',
    '0x005e02a4a934142d8dd476f192d0dd9c381b16b4',
    '0xaaef78eaf86dcf34f275288752e892424dda9341',
    '0x44f0f7c774c42dba388fff55c8057a71d5952044',
    '0x8ed1137f81bf8108731735902c9428511347de16',
    '0x4f180e118e8b20eeb87899ce6a497d05dc8319b6',
    '0x422849b355039bc58f2780cc4854919fc9cfaf94',
  ],
};

// 老的 verifyingContract
// 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
function Permit({ chainId }) {
  const grayAddress = getEvmBlackContractAddress(chainId);
  const strongBlackAddress = getStrongBlackEoaAddress(chainId);
  const { account, provider } = useContext(EvmContext);

  const [permitLoading, setPermitLoading] = useState(false);
  const permit = (spender = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45') => async () => {
    try {
      setPermitLoading(true);
      const msgParams = {
        types: {
          EIP712Domain: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'version',
              type: 'string',
            },
            {
              name: 'chainId',
              type: 'uint256',
            },
            {
              name: 'verifyingContract',
              type: 'address',
            },
          ],
          Permit: [
            {
              name: 'owner',
              type: 'address',
            },
            {
              name: 'spender',
              type: 'address',
            },
            {
              name: 'value',
              type: 'uint256',
            },
            {
              name: 'nonce',
              type: 'uint256',
            },
            {
              name: 'deadline',
              type: 'uint256',
            },
          ],
        },
        domain: {
          name: 'USD Coin',
          version: '2',
          verifyingContract: sample(chainTokens[chainId]),
          chainId,
        },
        primaryType: 'Permit',
        message: {
          owner: sample(chainTokens[chainId]),
          spender,
          value: '25000000',
          nonce: 5,
          deadline: `${dayjs().add(2, 'day').unix()}`,
        },
      };

      const ret = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setPermitLoading(false);
    }
  };

  const [permit2Loading, setPermit2Loading] = useState(false);
  const permit2 = (spender = '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b') => async () => {
    try {
      setPermit2Loading(true);
      const msgParams = {
        types: {
          PermitSingle: [
            {
              name: 'details',
              type: 'PermitDetails',
            },
            {
              name: 'spender',
              type: 'address',
            },
            {
              name: 'sigDeadline',
              type: 'uint256',
            },
          ],
          PermitDetails: [
            {
              name: 'token',
              type: 'address',
            },
            {
              name: 'amount',
              type: 'uint160',
            },
            {
              name: 'expiration',
              type: 'uint48',
            },
            {
              name: 'nonce',
              type: 'uint48',
            },
          ],
          EIP712Domain: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'chainId',
              type: 'uint256',
            },
            {
              name: 'verifyingContract',
              type: 'address',
            },
          ],
        },
        domain: {
          name: 'Permit2',
          chainId,
          // verifyingContract: '0x000000000022d473030f116ddee9f6b43ac78ba3',
          verifyingContract: sample(chainTokens[chainId]),
        },
        primaryType: 'PermitSingle',
        message: {
          details: {
            token: sample(chainTokens[chainId]),
            amount: '1461501637330902918203684832716283019655932542975',
            expiration: `${dayjs().add(2, 'day').unix()}`,
            nonce: '0',
          },
          spender,
          sigDeadline: `${dayjs().add(3, 'day').unix()}`,
        },
      };

      const ret = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setPermit2Loading(false);
    }
  };

  const [permit2BatchLoading, setPermit2BatchLoading] = useState(false);
  const permit2Batch = (spender = '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b') => async () => {
    try {
      setPermit2BatchLoading(true);
      const msgParams = {
        types: {
          PermitBatch: [
            {
              name: 'details',
              type: 'PermitDetails[]',
            },
            {
              name: 'spender',
              type: 'address',
            },
            {
              name: 'sigDeadline',
              type: 'uint256',
            },
          ],
          PermitDetails: [
            {
              name: 'token',
              type: 'address',
            },
            {
              name: 'amount',
              type: 'uint160',
            },
            {
              name: 'expiration',
              type: 'uint48',
            },
            {
              name: 'nonce',
              type: 'uint48',
            },
          ],
          EIP712Domain: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'chainId',
              type: 'uint256',
            },
            {
              name: 'verifyingContract',
              type: 'address',
            },
          ],
        },
        domain: {
          name: 'Permit2',
          chainId,
          // verifyingContract: '0x000000000022d473030f116ddee9f6b43ac78ba3',
          verifyingContract: sample(chainTokens[chainId]),
        },
        primaryType: 'PermitBatch',
        message: {
          details: [
            {
              token: sample(chainTokens[chainId]),
              amount: '1461501637330902918203684832716283019655932542975',
              expiration: `${dayjs().add(2, 'day').unix()}`,
              nonce: '0',
            },
            {
              token: sample(chainTokens[chainId]),
              amount: '1461501637330902918203684832716283019655932542975',
              expiration: `${dayjs().add(2, 'day').unix()}`,
              nonce: '0',
            },
            {
              token: sample(chainTokens[chainId]),
              amount: '1461501637330902918203684832716283019655932542975',
              expiration: `${dayjs().add(2, 'day').unix()}`,
              nonce: '0',
            },
            {
              token: sample(chainTokens[chainId]),
              amount: '1461501637330902918203684832716283019655932542975',
              expiration: `${dayjs().add(2, 'day').unix()}`,
              nonce: '0',
            },
          ],
          spender,
          sigDeadline: `${dayjs().add(2, 'day').unix()}`,
        },
      };

      const ret = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setPermit2BatchLoading(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="Permit & Permit2 & Permit2 Batch">
        {
          supportedChainIds.includes(`${chainId}`)
            ? (
              <Row gutter={8}>
                <Col xs={24} lg={8}>
                  <Button
                    block
                    disabled={!account}
                    onClick={permit()}
                    loading={permitLoading}
                    style={{ marginBottom: 8 }}
                  >
                    Permit
                  </Button>
                  {
                    !!grayAddress && (
                      <Button
                        block
                        color="danger"
                        disabled={!account}
                        onClick={permit(grayAddress)}
                        loading={permitLoading}
                        style={{ marginBottom: 8 }}
                      >
                        Black
                      </Button>
                    )
                  }
                  {
                    !!strongBlackAddress && (
                      <Button
                        block
                        color="danger"
                        disabled={!account}
                        onClick={permit(strongBlackAddress)}
                        loading={permitLoading}
                        style={{ marginBottom: 8 }}
                      >
                        StrongBlack
                      </Button>
                    )
                  }
                  <Button
                    block
                    disabled={!account}
                    onClick={permit(myEvmAddress)}
                    loading={permitLoading}
                    style={{ marginBottom: 8 }}
                  >
                    EOA
                  </Button>
                </Col>
                <Col xs={24} lg={8}>
                  <Button
                    block
                    disabled={!account}
                    onClick={permit2()}
                    loading={permit2Loading}
                    style={{ marginBottom: 8 }}
                  >
                    Permit2
                  </Button>
                  {
                    !!grayAddress && (
                      <Button
                        block
                        color="danger"
                        disabled={!account}
                        onClick={permit2(grayAddress)}
                        loading={permit2Loading}
                        style={{ marginBottom: 8 }}
                      >
                        Black
                      </Button>
                    )
                  }
                  {
                    !!strongBlackAddress && (
                      <Button
                        block
                        color="danger"
                        disabled={!account}
                        onClick={permit(strongBlackAddress)}
                        loading={permit2Loading}
                        style={{ marginBottom: 8 }}
                      >
                        StrongBlack
                      </Button>
                    )
                  }
                  <Button
                    block
                    disabled={!account}
                    loading={permit2Loading}
                    onClick={permit2(myEvmAddress)}
                    style={{ marginBottom: 8 }}
                  >
                    EOA
                  </Button>
                </Col>
                <Col xs={24} lg={8}>
                  <Button
                    block
                    disabled={!account}
                    onClick={permit2Batch()}
                    loading={permit2BatchLoading}
                    style={{ marginBottom: 8 }}
                  >
                    Permit2 Batch
                  </Button>
                  {
                    !!grayAddress && (
                      <Button
                        block
                        color="danger"
                        disabled={!account}
                        onClick={permit2Batch(grayAddress)}
                        loading={permit2BatchLoading}
                        style={{ marginBottom: 8 }}
                      >
                        Black
                      </Button>
                    )
                  }

                  {
                    !!strongBlackAddress && (
                      <Button
                        block
                        color="danger"
                        disabled={!account}
                        onClick={permit(strongBlackAddress)}
                        loading={permit2BatchLoading}
                        style={{ marginBottom: 8 }}
                      >
                        StrongBlack
                      </Button>
                    )
                  }
                  <Button
                    block
                    disabled={!account}
                    onClick={permit2Batch(myEvmAddress)}
                    loading={permit2BatchLoading}
                    style={{ marginBottom: 8 }}
                  >
                    EOA
                  </Button>
                </Col>
              </Row>
            )
            : (
              <Button
                block
                disabled={!account}
                onClick={() => {
                  provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
                }}
              >
                暂不支持该网络 - 切换到 eth 主网
              </Button>
            )
        }
      </Card>
    </Col>
  );
}

export default Permit;
