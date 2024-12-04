import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useCurrentWallet,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { blackAddress, myAddress, strongBlackAddress } from '../../const';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignTransaction() {
  const account = useCurrentAccount();
  const wallet = useCurrentWallet();
  console.log('wallets', wallet);
  const address = account?.address;

  const sign = useSignAndExecuteTransaction();

  const [sendSuiLoading, setSendSuiLoading] = useState(false);
  const sendSui =
    (toAddress = myAddress) =>
    async () => {
      try {
        setSendSuiLoading(true);
        const transaction = new Transaction();
        const coin = transaction.splitCoins(transaction.gas, [10]);
        transaction.transferObjects([coin], toAddress);
        const resp = await sign.mutateAsync({ transaction });
        console.log(resp);
        toastSuccess();
      } catch (error) {
        console.log(error);
        toastFail();
      } finally {
        setSendSuiLoading(false);
      }
    };

  return (
    <Card title="SignTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!address}
          loading={sendSuiLoading}
          onClick={sendSui()}
        >
          sendSui
        </Button>

        <Button
          block
          color="danger"
          disabled={!address}
          loading={sendSuiLoading}
          onClick={sendSui(blackAddress)}
        >
          sendSui to Black Address
        </Button>

        <Button
          block
          color="danger"
          disabled={!address}
          loading={sendSuiLoading}
          onClick={sendSui(strongBlackAddress)}
        >
          sendSui to Strong Black Address
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransaction;
