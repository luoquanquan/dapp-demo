import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import { toastFail } from '../../../../../utils/toast';
import { handleNearResp, wNearContractId } from '../../../const';

const myNearWallet = ['efad2cea4242f19eba36ea0038161fc803e2af6682b575fa1c4e9d48f8019dae', 'c1f0f7bc0deed7d2151e7987ad2aca74b8e856c1f87efa93fec1ff4075b4d6e4'];
function Common({ account, provider }) {
  const getMyNearWallet = () => (myNearWallet[0] === account ? myNearWallet[1] : myNearWallet[0]);

  const [sendMoneyLoading, setSendMoneyLoading] = useState(false);
  const sendMoney = async () => {
    try {
      setSendMoneyLoading(true);
      const resp = await provider.sendMoney({
        receiverId: getMyNearWallet(),
        amount: '10000000000000000',
      });

      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSendMoneyLoading(false);
    }
  };

  const [swapToWNearLoading, setSwapToWNearLoading] = useState(false);
  const swapToWNear = (fullParams = false, withGas = false) => async () => {
    try {
      setSwapToWNearLoading(true);
      const dataForSign = fullParams ? {
        receiverId: wNearContractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'near_deposit',
              args: {},
              deposit: '1250000000000000000000',
            },
          },
        ],
      } : {
        receiverId: wNearContractId,
        actions: [
          {
            methodName: 'near_deposit',
            args: {},
            deposit: '1250000000000000000000',
            ...(withGas ? { gas: '300000000000000' } : {}),
          },
        ],
      };
      const resp = await provider.signAndSendTransaction(dataForSign);
      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSwapToWNearLoading(false);
    }
  };
  const swapToWNea2 = (fullParams = false, withGas = false) => async () => {
    try {
      setSwapToWNearLoading(true);
      const dataForSign = fullParams ? {
        receiverId: wNearContractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'near_deposit',
              args: {},
              deposit: '1250000000000000000000',
            },
          },
        ],
      } : {
        receiverId: wNearContractId,
        actions: [
          {
            methodName: 'near_deposit',
            args: {},
            deposit: '1250000000000000000000',
            ...(withGas ? { gas: '300000000000000' } : {}),
          },
        ],
      };
      const resp = await provider.signTransaction(dataForSign);
      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSwapToWNearLoading(false);
    }
  };

  const [sendWNearLoading, setSendWNearLoading] = useState(false);
  const sendWNear = ({ useU8Array = false } = {}) => async () => {
    const argsJson = {
      receiver_id: getMyNearWallet(),
      amount: '10000',
    };
    try {
      setSendWNearLoading(true);
      const dataForSign = {
        receiverId: wNearContractId,
        actions: [
          {
            methodName: 'ft_transfer',
            args: useU8Array ? Buffer.from(JSON.stringify(argsJson), 'utf8') : argsJson,
            deposit: '1',
          },
        ],
      };
      const resp = await provider.signAndSendTransaction(dataForSign);
      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSendWNearLoading(false);
    }
  };

  const [
    swapAndSendWNearWithActionsLoading,
    setSwapAndSendWNearWithActionsLoading] = useState(false);
  const swapAndSendWNearWithActions = ({ useU8Array = false } = {}) => async () => {
    try {
      setSwapAndSendWNearWithActionsLoading(true);
      const argsJson = {
        receiver_id: getMyNearWallet(),
        amount: '1000',
      };

      const transaction = {
        receiverId: wNearContractId,
        actions: [
          {
            methodName: 'near_deposit',
            args: {},
            deposit: '1250000000000000000000',
          },
          {
            methodName: 'ft_transfer',
            args: useU8Array ? Buffer.from(JSON.stringify(argsJson), 'utf8') : argsJson,
            deposit: '1',
          },
        ],
      };

      const resp = await provider.signAndSendTransaction(transaction);
      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSwapAndSendWNearWithActionsLoading(false);
    }
  };

  const [
    swapAndSendWNearWithTransactionsLoading,
    setSwapAndSendWNearWithTransactionsLoadingLoading] = useState(false);
  const swapAndSendWNearWithTransactions = ({
    fullParams = false,
    useU8Array = false,
  } = {}) => async () => {
    try {
      setSwapAndSendWNearWithTransactionsLoadingLoading(true);

      const argsJson = {
        receiver_id: getMyNearWallet(),
        amount: '10000000000',
      };

      const dataForCheck = fullParams ? {
        transactions: [
          {
            receiverId: wNearContractId,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'near_deposit',
                  args: {},
                  deposit: '1000000000000000',
                },
              },
            ],
          },
          {
            receiverId: wNearContractId,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'ft_transfer',
                  args: useU8Array ? Buffer.from(JSON.stringify(argsJson), 'utf8') : argsJson,
                  deposit: '1',
                },
              },
            ],
          },
        ],
      } : {
        transactions: [
          {
            receiverId: wNearContractId,
            actions: [
              {
                methodName: 'near_deposit',
                args: {},
                deposit: '1000000000000000',
              },
            ],
          },
          {
            receiverId: wNearContractId,
            actions: [
              {
                methodName: 'ft_transfer',
                args: {
                  receiver_id: getMyNearWallet(),
                  amount: '10000000000',
                },
                deposit: '1',
              },
            ],
          },
        ],
      };
      const resp = await provider.requestSignTransactions(dataForCheck);
      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSwapAndSendWNearWithTransactionsLoadingLoading(false);
    }
  };

  const deployContract = async () => {
    try {
      const resp = await provider.signAndSendTransaction({
        actions: [{
          type: 'DeployContract',
          params: {
            code: '12345',
          },
        }],
      });
      handleNearResp(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    }
  };

  return (
    <Card direction="vertical" title="普通交互 - 需要唤起插件">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={sendMoneyLoading}
          onClick={sendMoney}
          disabled={!account}
        >
          sendMoney
        </Button>

        <Card title="signAndSendTransaction">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              loading={swapToWNearLoading}
              onClick={swapToWNear()}
              disabled={!account}
            >
              swapToWNear
            </Button>

            <Button
              block
              loading={swapToWNearLoading}
              onClick={swapToWNear(false, true)}
              disabled={!account}
            >
              swapToWNear(withGas)
            </Button>

            <Button
              block
              loading={swapToWNearLoading}
              onClick={swapToWNear(true)}
              disabled={!account}
            >
              swapToWNear(full params)
            </Button>

            <Button
              block
              loading={sendWNearLoading}
              onClick={sendWNear()}
              disabled={!account}
            >
              sendWNear
            </Button>

            <Button
              block
              loading={sendWNearLoading}
              onClick={sendWNear({ useU8Array: true })}
              disabled={!account}
            >
              sendWNear(with U8Array args)
            </Button>
          </Space>
        </Card>

        <Card title="signTransaction">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              loading={swapToWNearLoading}
              onClick={swapToWNea2()}
              disabled={!account}
            >
              swapToWNear signTransaction
            </Button>
          </Space>
        </Card>

        <Card title="signAndSendTransaction multi actions">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              loading={swapAndSendWNearWithActionsLoading}
              onClick={swapAndSendWNearWithActions()}
              disabled={!account}
            >
              swapAndSendWNear()
            </Button>

            <Button
              block
              loading={swapAndSendWNearWithActionsLoading}
              onClick={swapAndSendWNearWithActions({ useU8Array: true })}
              disabled={!account}
            >
              swapAndSendWNear(with U8Array args)
            </Button>
          </Space>
        </Card>

        <Card title="requestSignTransactions">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              block
              loading={swapAndSendWNearWithTransactionsLoading}
              onClick={swapAndSendWNearWithTransactions()}
              disabled={!account}
            >
              swapAndSendWNear
            </Button>

            <Button
              block
              loading={swapAndSendWNearWithTransactionsLoading}
              onClick={swapAndSendWNearWithTransactions({ fullParams: true })}
              disabled={!account}
            >
              swapAndSendWNear(full params)
            </Button>
            <Button
              block
              loading={swapAndSendWNearWithTransactionsLoading}
              onClick={swapAndSendWNearWithTransactions({ useU8Array: true })}
              disabled={!account}
            >
              swapAndSendWNear(with U8Array args)
            </Button>
          </Space>
        </Card>
        <Button
          block
          onClick={deployContract}
          disabled={!account}
        >
          deployContract(Not supported)
        </Button>

      </Space>
    </Card>
  );
}

export default Common;
