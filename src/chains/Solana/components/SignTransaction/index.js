import {
  Button,
  Card, Space, message,
} from 'antd';
import { useState } from 'react';
import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { mySolAddress } from '../../../../utils/const';

const connection = new Connection('https://solana-mainnet.core.chainstack.com/4916995a26690b007a6ada71d9b1ac4a');

export default function SignTransaction({ account }) {
  const lamports = LAMPORTS_PER_SOL / 10 ** 4;
  const [sendMeSolLoading, setSendMeSolLoading] = useState(false);
  const sendMeSol = async () => {
    try {
      setSendMeSolLoading(true);
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: solana.publicKey,
          toPubkey: new PublicKey(mySolAddress),
          lamports,
        }),
      );

      const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      console.log('Current log: recentBlockhash: ', recentBlockhash);
      transaction.recentBlockhash = recentBlockhash;
      transaction.feePayer = solana.publicKey;
      const signedTransaction = await solana.signTransaction(transaction);
      console.log('Current log: signedTransaction: ', signedTransaction);
      const ret = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Current log: ret: ', ret);
    } catch (error) {
      message.error('操作失败, 请打开控制台查看错误信息');
      console.log('Current log: error: ', error);
    } finally {
      setSendMeSolLoading(false);
    }
  };

  // const [sendMeUSDTLoading, setSendMeUSDTLoading] = useState(false);
  // const sendMeUSDT = async () => {
  //   try {
  //     setSendMeUSDTLoading(true);
  //   } catch (error) {
  //     message.error('操作失败, 请打开控制台查看错误信息');
  //     console.log('Current log: error: ', error);
  //   } finally {
  //     setSendMeUSDTLoading(false);
  //   }
  // };

  // const [usdtBalance, setUsdtBalance] = useState(0);
  // const getUSDTBalance = async () => {
  //   try {
  //     const destinationAssociatedTokenAddress = await TokenInstruction.getAssociatedTokenAddress(
  //       ASSOCIATED_TOKEN_PROGRAM_ID,
  //       TOKEN_PROGRAM_ID,
  //       new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'), // 代币mint地址
  //       new PublicKey(account), // 账户地址
  //       true,
  //     );
  //     const destination = await connection.getAccountInfo(destinationAssociatedTokenAddress);
  //     console.log('Current log: destination: ', destination);
  //   } catch (error) {
  //     message.error('操作失败, 请打开控制台查看错误信息');
  //     console.log('Current log: error: ', error);
  //   }
  // };
  return (
    <Card title="合约交互 - 请打开控制台查看签名结果">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          disabled={!account}
          loading={sendMeSolLoading}
          onClick={sendMeSol}
        >
          sendMe
          {lamports / LAMPORTS_PER_SOL}
          SOL
        </Button>
        {/* <Button
          block
          disabled={!account}
          onClick={getUSDTBalance}
        >
          getUSDTBalance
        </Button> */}
      </Space>
    </Card>
  );
}
