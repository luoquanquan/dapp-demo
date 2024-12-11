import { useState } from 'react';
import { Button } from 'antd-mobile';
import * as solanaWeb3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { toastFail, toastSuccess } from '../../../../../utils/toast';
import { mySolAddress } from '../../../const';

function ApproveMessage({ account, connection }) {
  const [approveLoading, setApproveLoading] = useState(false);
  const approve = async () => {
    try {
      setApproveLoading(true);
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
      setApproveLoading(false);
    }
  };

  return (
    <Button
      block
      disabled={!account}
      loading={approveLoading}
      onClick={approve}
    >
      Approve usdt
    </Button>
  );
}

export default ApproveMessage;
