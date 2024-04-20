import {
  Button, Card, Row, Col, Space, message, Alert,
} from 'antd';
import { useContext, useState } from 'react';
import dayjs from 'dayjs';
import { sample } from 'lodash';
import EvmContext from '../../../../context';
import { grayAddress } from '../../../const';

const supportedChainIds = [
  '1',
  '137',
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
};

// 老的 verifyingContract
// 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
function Permit({ chainId }) {
  const { account } = useContext(EvmContext);

  const [result, setResult] = useState('');

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

      const ret = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log('Current log: ret: ', ret);
      setResult(ret);
    } catch (error) {
      console.log(error);
      message.error(error.message);
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

      const ret = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log('Current log: ret: ', ret);
      setResult(ret);
    } catch (error) {
      console.log('Current log: error: ', error);
      message.error(error.message);
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

      const ret = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msgParams)],
      });
      console.log('Current log: ret: ', ret);
      setResult(ret);
    } catch (error) {
      console.log('Current log: error: ', error);
      message.error(error.message);
    } finally {
      setPermit2BatchLoading(false);
    }
  };

  return (
    <Col span={12}>
      <Card direction="vertical" title="Permit & Permit2 & Permit2 Batch">
        {
          supportedChainIds.includes(`${chainId}`)
            ? (
              <>
                <Row gutter={8}>
                  <Col span={8}>
                    <Space style={{ width: '100%' }} direction="vertical">
                      <Button
                        block
                        disabled={!account}
                        onClick={permit()}
                        loading={permitLoading}
                      >
                        Permit
                      </Button>
                      <Button
                        block
                        disabled={!account}
                        onClick={permit(grayAddress)}
                        loading={permitLoading}
                      >
                        Permit Gray
                      </Button>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space style={{ width: '100%' }} direction="vertical">
                      <Button
                        block
                        disabled={!account}
                        onClick={permit2()}
                        loading={permit2Loading}
                      >
                        Permit2
                      </Button>
                      <Button
                        block
                        disabled={!account}
                        onClick={permit2(grayAddress)}
                        loading={permit2Loading}
                      >
                        Permit2 Gray
                      </Button>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space style={{ width: '100%' }} direction="vertical">
                      <Button
                        block
                        disabled={!account}
                        onClick={permit2Batch()}
                        loading={permit2BatchLoading}
                      >
                        Permit2 Batch
                      </Button>
                      <Button
                        block
                        disabled={!account}
                        onClick={permit2Batch(grayAddress)}
                        loading={permit2BatchLoading}
                      >
                        Permit2 Batch Gray
                      </Button>
                    </Space>
                  </Col>
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <Col span={24} gutter={8}>
                    <Space style={{ width: '100%' }} direction="vertical">
                      <Alert
                        message="Result"
                        description={result}
                      />
                      <Alert
                        type="error"
                        description="Permit2 和前边的两种异常不会同时出现"
                      />
                    </Space>
                  </Col>
                </Row>
              </>
            )
            : (
              <Button
                block
                disabled={!account}
                onClick={() => {
                  ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
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
