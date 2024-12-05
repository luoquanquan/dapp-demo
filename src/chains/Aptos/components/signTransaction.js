import { useRef, useState } from 'react';
import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import {
  AptosConfig, Aptos, Network, Account,
} from '@aptos-labs/ts-sdk';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastFail, toastSuccess } from '../../../utils/toast';

function SignTransaction({ account, disabled }) {
  const [signing, setSigning] = useState(false);
  const ref = useRef(() => {
    const config = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(config);
    return aptos;
  });

  const aptos = ref.current();

  const buildTransaction = async ({ sender }) => {
    const txData = await aptos.transaction.build.simple({
      sender,
      data: {
        function: '0x1::aptos_account::transfer',
        functionArguments: [sender, 100],
      },
    });
    return txData;
  };

  const simulateTransaction = async () => {
    const transactionData = await buildTransaction({ sender: account.address });
    try {
      const result = await aptos.transaction.simulate.simple({
        signerPublicKey: account.publicKey,
        transaction: transactionData,
      });
      console.log(result);
    } catch (err) {
      console.error('Simulate transaction error: ', err);
    }
  };

  const simulateTransactionWithAccount = async () => {
    const sender = Account.generate();
    const receiver = Account.generate();

    const config = new AptosConfig({ network: Network.TESTNET });
    const aptosTestnet = new Aptos(config);

    await aptosTestnet.fundAccount({
      accountAddress: sender.accountAddress,
      amount: 100_000_000,
    });

    // 1. Build the transaction to preview the impact of it
    const transaction = await aptosTestnet.transaction.build.simple({
      sender: sender.accountAddress,
      data: {
        // All transactions on Aptos are implemented via smart contracts.
        function: '0x1::aptos_account::transfer',
        functionArguments: [receiver.accountAddress, 100],
      },
    });

    // 2. Simulate to see what would happen if we execute this transaction
    const [userTransactionResponse] = await aptosTestnet.transaction.simulate.simple({
      signerPublicKey: sender.publicKey,
      transaction,
    });
    console.log('Simulate with Account.generate(): ', userTransactionResponse);
  };

  const handleSignTransaction = async () => {
    setSigning(true);
    const transactionData = await buildTransaction({ sender: account.address.toString() });
    try {
      console.log('handleSignTransaction - txData: ', transactionData);
      const signedTx = await window.aptos.signTransaction(transactionData);
      console.log('signedTx', signedTx);
      // TODO: submit transaction
      // const result = await aptos.waitForTransaction({ transactionHash: tx });
      // console.log(result);
      toastSuccess();
    } catch (err) {
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        toastFail();
      }
    } finally {
      setSigning(false);
    }
  };

  const handleSignAndSubmitTransaction = async () => {
    setSigning(true);
    const transactionData = await buildTransaction({ sender: account.address.toString() });
    try {
      const tx = await window.aptos.signAndSubmitTransaction(transactionData);
      console.log(tx);
      const result = await aptos.waitForTransaction({
        transactionHash: tx,
      });
      console.log(result);
      toastSuccess();
    } catch (err) {
      if (err.code === ConnectKitErrorCodes.USER_REJECTS_ERROR) {
        message.error('User rejected the request');
      } else {
        toastFail();
      }
    } finally {
      setSigning(false);
    }
  };

  return (
    <Card title="Sign Transaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={simulateTransactionWithAccount}
          disabled={disabled}
          loading={signing}
        >
          simulateTransactionWithAccount
        </Button>

        <Button
          block
          onClick={simulateTransaction}
          disabled={disabled}
          loading={signing}
        >
          simulateTransaction
        </Button>

        <Button
          block
          onClick={handleSignTransaction}
          disabled={disabled}
          loading={signing}
        >
          signTransaction
        </Button>

        <Button
          block
          onClick={handleSignAndSubmitTransaction}
          disabled={disabled}
          loading={signing}
        >
          signAndSubmitTransaction
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransaction;
