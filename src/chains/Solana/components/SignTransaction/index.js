import {
  Button,
  Card, Col, Row, Space, message,
} from 'antd';
import { useState } from 'react';
import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { mySolAddress } from '../../../../utils/const';

const lamports = LAMPORTS_PER_SOL / 10 ** 4;
const withConnection = (connection, toPubkey = new PublicKey(mySolAddress)) => async () => {
  const tx = new Transaction();

  tx.add(
    SystemProgram.transfer({
      fromPubkey: solana.publicKey,
      toPubkey,
      lamports,
    }),
  );
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.recentBlockhash = recentBlockhash;
  tx.feePayer = solana.publicKey;

  return tx;
};

export default function SignTransaction({ account, connection }) {
  const generateTx = withConnection(connection);

  const [signTransactionLoading, setSignTransactionLoading] = useState(false);
  const signTransaction = async () => {
    try {
      setSignTransactionLoading(true);
      const tx = await generateTx();
      const signedTx = await solana.signTransaction(tx);
      console.log('Current log: signedTx: ', signedTx);
      const txHash = await connection.sendRawTransaction(signedTx.serialize());
      console.log('Current log: txHash: ', txHash);
    } catch (error) {
      message.error('操作失败, 请打开控制台查看错误信息');
      console.log('error: ', error);
    } finally {
      setSignTransactionLoading(false);
    }
  };

  const [signAllTransactionsLoading, setSignAllTransactionsLoading] = useState(false);
  const signAllTransactions = async () => {
    try {
      setSignAllTransactionsLoading(true);
      const txs = [
        await generateTx(),
        await generateTx(),
      ];
      const signedTxs = await solana.signAllTransactions(txs);
      console.log('Current log: signedTxs: ', signedTxs);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < signedTxs.length; i++) {
        const tx = signedTxs[i];
        // eslint-disable-next-line no-await-in-loop
        const txHash = await connection.sendRawTransaction(tx.serialize());
        console.log('Current log: txHash: ', txHash);
      }
    } catch (error) {
      message.error('操作失败, 请打开控制台查看错误信息');
      console.log('error: ', error);
    } finally {
      setSignAllTransactionsLoading(false);
    }
  };

  const [signAndSendTransactionLoading, setSignAndSendTransactionLoading] = useState(false);
  const signAndSendTransaction = async () => {
    try {
      setSignAndSendTransactionLoading(true);
      const tx = await generateTx();
      const signedTx = await solana.signAndSendTransaction(tx);
      console.log('Current log: signedTx: ', signedTx);
    } catch (error) {
      message.error('操作失败, 请打开控制台查看错误信息');
      console.log('error: ', error);
    } finally {
      setSignAndSendTransactionLoading(false);
    }
  };

  return (
    <Card title="合约交互 - 请打开控制台查看签名信息">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="仅需钱包签名, dapp 广播">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                disabled={!account}
                loading={signTransactionLoading}
                onClick={signTransaction}
              >
                signTransaction
              </Button>

              <Button
                block
                disabled={!account}
                loading={signAllTransactionsLoading}
                onClick={signAllTransactions}
              >
                signAllTransactions
              </Button>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="钱包签名且广播">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                disabled={!account}
                loading={signAndSendTransactionLoading}
                onClick={signAndSendTransaction}
              >
                signAndSendTransaction
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
