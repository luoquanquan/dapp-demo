import { useState } from 'react';
import { Button, Space, Card } from 'antd-mobile';
import { message } from 'antd';
import { AptosConfig, Aptos, Network } from '@aptos-labs/ts-sdk';
import { ConnectKitErrorCodes } from '@repo/connect-kit';
import { toastFail, toastSuccess } from '../../../utils/toast';

function SignTransaction({ account, disabled }) {
  const [signing, setSigning] = useState(false);

  const buildTransaction = async ({ sender }) => {
    const config = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(config);
    return await aptos.transaction.build.simple({
      sender,
      data: {
        function:
          '0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::swap_exact_coin_for_coin_x1',
        typeArguments: [
          '0x1::aptos_coin::AptosCoin',
          '0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt',
          '0x0163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated',
          '0x80273859084bc47f92a6c2d3e9257ebb2349668a1b0fb3db1d759a04c7628855::router::BinStepV0V05',
        ],
        functionArguments: ['10000', ['9104'], ['5'], ['true']],
      },
    });
  };

  const handleSignTransaction = async () => {
    setSigning(true);
    const transactionData = await buildTransaction({ sender: account.address });
    try {
      const tx = await window.aptos.signTransaction(transactionData);
      console.log(tx);
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
    const transactionData = await buildTransaction({ sender: account.address });
    try {
      const tx = await window.aptos.signAndSubmitTransaction(transactionData);
      console.log(tx);
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
        <Button block onClick={handleSignTransaction} disabled={disabled} loading={signing}>
          signTransaction
        </Button>

        <Button block onClick={handleSignAndSubmitTransaction} disabled={disabled} loading={signing}>
          signAndSubmitTransaction
        </Button>

      </Space>
    </Card>
  );
}

export default SignTransaction;
