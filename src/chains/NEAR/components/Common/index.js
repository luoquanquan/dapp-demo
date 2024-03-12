import {
  Button, Card, Space, message,
} from 'antd';
import { useState } from 'react';
import { wNearContractId } from '../../const';

const myNearWallet = ['efad2cea4242f19eba36ea0038161fc803e2af6682b575fa1c4e9d48f8019dae', 'c1f0f7bc0deed7d2151e7987ad2aca74b8e856c1f87efa93fec1ff4075b4d6e4'];
function Common({ account }) {
  const getMyNearWallet = () => (myNearWallet[0] === account ? myNearWallet[1] : myNearWallet[0]);

  const [sendMoneyLoading, setSendMoneyLoading] = useState(false);
  const sendMoney = async () => {
    try {
      setSendMoneyLoading(true);
      const resp = await window.near.sendMoney({
        receiverId: getMyNearWallet(),
        amount: '10000000000000000',
      });

      console.log('Current log: resp: ', resp);
    } catch (error) {
      console.log('Current log: error: ', error);
      message.error(error.message);
    } finally {
      setSendMoneyLoading(false);
    }
  };

  const [swapToWNearLoading, setSwapToWNearLoading] = useState(false);
  const swapToWNear = async () => {
    try {
      setSwapToWNearLoading(true);
      const dataForSign = {
        receiverId: wNearContractId,
        actions: [
          {
            // methodName: 'near_deposit',
            methodName: 'storage_deposit',
            args: {},
            deposit: '1250000000000000000000',
          },
        ],
      };
      console.log('Current log: dataForSign: ', dataForSign);
      const resp = await window.near.signAndSendTransaction(dataForSign);
      console.log('Current log: resp: ', resp);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSwapToWNearLoading(false);
    }
  };

  const [sendWNearLoading, setSendWNearLoading] = useState(false);
  const sendWNear = async () => {
    try {
      setSendWNearLoading(true);
      const dataForSign = {
        receiverId: wNearContractId,
        actions: [
          {
            methodName: 'ft_transfer',
            args: {
              receiver_id: getMyNearWallet(),
              amount: '10000',
            },
            deposit: '1',
          },
        ],
      };
      const resp = await window.near.signAndSendTransaction(dataForSign);
      console.log('Current log: resp: ', resp);
    } catch (error) {
      console.log('Current log: error: ', error);
      message.error(error.message);
    } finally {
      setSendWNearLoading(false);
    }
  };

  const [
    swapAndSendWNearWithActionsLoading,
    setSwapAndSendWNearWithActionsLoading] = useState(false);
  const swapAndSendWNearWithActions = async () => {
    try {
      setSwapAndSendWNearWithActionsLoading(true);

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
            args: {
              receiver_id: getMyNearWallet(),
              amount: '1000',
            },
            deposit: '1',
          },
        ],
      };

      console.log('Current log: transaction: ', transaction);
      const resp = await window.near.signAndSendTransaction(transaction);
      console.log('Current log: resp: ', resp);
    } catch (error) {
      console.log('Current log: error: ', error);
      message.error(error.message);
    } finally {
      setSwapAndSendWNearWithActionsLoading(false);
    }
  };

  const [
    swapAndSendWNearWithTransactionsLoading,
    setSwapAndSendWNearWithTransactionsLoadingLoading] = useState(false);
  const swapAndSendWNearWithTransactions = async () => {
    try {
      setSwapAndSendWNearWithTransactionsLoadingLoading(true);

      const dataForCheck = {
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
      console.log('Current log: dataForCheck: ', dataForCheck);
      const resp = await window.near.requestSignTransactions(dataForCheck);
      console.log('Current log: resp: ', resp);
    } catch (error) {
      console.log('Current log: error: ', error);
      message.error(error.message);
    } finally {
      setSwapAndSendWNearWithTransactionsLoadingLoading(false);
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

        <Button
          block
          loading={swapToWNearLoading}
          onClick={swapToWNear}
          disabled={!account}
        >
          swapToWNear(signAndSendTransaction)
        </Button>

        <Button
          block
          loading={sendWNearLoading}
          onClick={sendWNear}
          disabled={!account}
        >
          sendWNear(signAndSendTransaction)
        </Button>

        <Button
          block
          loading={swapAndSendWNearWithActionsLoading}
          onClick={swapAndSendWNearWithActions}
          disabled={!account}
        >
          swapAndSendWNearWithActions(signAndSendTransaction)
        </Button>

        <Button
          block
          loading={swapAndSendWNearWithTransactionsLoading}
          onClick={swapAndSendWNearWithTransactions}
          disabled={!account}
        >
          swapAndSendWNearWithTransactions(requestSignTransactions)
        </Button>
      </Space>
    </Card>
  );
}

export default Common;
