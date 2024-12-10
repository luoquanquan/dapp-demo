import { useState } from 'react';
import { Button } from 'antd-mobile';
import * as solanaWeb3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { toastFail, toastSuccess } from '../../../../../utils/toast';
import { mySolAddress } from '../../../const';

function SendAndApprove({ account, connection }) {
  const [sendAndApproveLoading, setSendAndApproveLoading] = useState(false);
  const sendAndApprove = async () => {
    try {
      setSendAndApproveLoading(true);

      const amount = 1000;
      const fromPubkey = new solanaWeb3.PublicKey(account);
      const toPubkey = new solanaWeb3.PublicKey(mySolAddress);
      const tokenProgramId = new solanaWeb3.PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
      tokenProgramId.toBuffer();
      const PROGRAM_ID = new solanaWeb3.PublicKey(splToken.TOKEN_PROGRAM_ID);
      PROGRAM_ID.toBuffer();

      const fromAddrAccount = await splToken.getAssociatedTokenAddress(
        tokenProgramId,
        fromPubkey,
      );

      const toAddrAccount = await splToken.getAssociatedTokenAddress(
        tokenProgramId,
        toPubkey,
      );

      const sendSolIns = solanaWeb3.SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: 1e6,
      });

      const decimals = 6;

      const approveIns = splToken.createApproveCheckedInstruction(
        fromAddrAccount,
        tokenProgramId,
        toAddrAccount,
        fromPubkey,
        amount,
        decimals,
        [],
        PROGRAM_ID,
      );

      const tx = new solanaWeb3.Transaction();

      tx.add(
        sendSolIns,
        approveIns,
      );

      const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.recentBlockhash = recentBlockhash;
      tx.feePayer = solana.publicKey;
      console.log('Current log: solana: ', solana);
      const signedTx = await solana.signTransaction(tx);
      console.log(signedTx);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSendAndApproveLoading(false);
    }
  };

  return (
    <Button
      block
      disabled={!account}
      loading={sendAndApproveLoading}
      onClick={sendAndApprove}
    >
      send sol And Approve usdt
    </Button>
  );
}

export default SendAndApprove;
