import {
  Button,
  Card, Col, Row, Space, message,
} from 'antd';
import { useState } from 'react';
import {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import { mySolAddress } from '../../../../utils/const';

export default function SignTransaction({ account }) {
  const sendSol = async () => {
    const connection = new Connection('https://morning-ancient-crater.solana-mainnet.quiknode.pro/5e0b497a55b41fe0eebaac48f784367e8b98f706/');
    const recentBlockhash = await connection.getRecentBlockhash();
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: account,
    });

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: mySolAddress,
        lamports: LAMPORTS_PER_SOL,
      }),
    );

    const signedTransaction = await solana.signTransaction(transaction);
    // const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  };

  return (
    <Card title="合约交互 - 请打开控制台查看签名结果">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!account}
          loading={false}
          onClick={sendSol}
        >
          发送 SOL
        </Button>
      </Space>
    </Card>
  );
}
