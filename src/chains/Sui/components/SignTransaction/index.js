import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import {
  useCurrentAccount, useSignAndExecuteTransaction,
  useSignTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { blackAddress, myAddress, strongBlackAddress } from '../../const';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignTransaction() {
  const account = useCurrentAccount();
  const address = account?.address;

  const signTransaction = useSignTransaction();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();

  const [sendSuiLoading, setSendSuiLoading] = useState(false);
  const sendSui = ({ signFn = signAndExecuteTransaction, toAddress = myAddress } = {}) => async () => {
    try {
      setSendSuiLoading(true);
      const transaction = new Transaction();
      const coin = transaction.splitCoins(transaction.gas, [10]);
      transaction.transferObjects([coin], toAddress);
      const resp = await signFn.mutateAsync({ transaction });
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
    <>
      <Card title="signTransaction">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!address}
            loading={sendSuiLoading}
            onClick={sendSui({ signFn: signTransaction })}
          >
            sendSui
          </Button>

          <Button
            block
            color="danger"
            disabled={!address}
            loading={sendSuiLoading}
            onClick={sendSui({ signFn: signTransaction, toAddress: blackAddress })}
          >
            sendSui to Black Address
          </Button>

          <Button
            block
            color="danger"
            disabled={!address}
            loading={sendSuiLoading}
            onClick={sendSui({ signFn: signTransaction, toAddress: strongBlackAddress })}
          >
            sendSui to Strong Black Address
          </Button>
        </Space>
      </Card>
      <Card title="signAndExecuteTransaction">
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
            onClick={sendSui({ toAddress: blackAddress })}
          >
            sendSui to Black Address
          </Button>

          <Button
            block
            color="danger"
            disabled={!address}
            loading={sendSuiLoading}
            onClick={sendSui({ toAddress: strongBlackAddress })}
          >
            sendSui to Strong Black Address
          </Button>
        </Space>
      </Card>
    </>

  );
}

export default SignTransaction;
