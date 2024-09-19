import { useState } from 'react';
import { Button } from 'antd-mobile';
import * as solanaWeb3 from '@solana/web3.js';
import { toastFail, toastSuccess } from '../../../../../utils/toast';
import { mySolAddress } from '../../../const';

function Assign({ account, connection }) {
  const [sendUSDTLoading, setSendUSDTLoading] = useState(false);
  const sendUSDT = async () => {
    try {
      setSendUSDTLoading(true);
      const tx = new solanaWeb3.Transaction();

      tx.add(
        solanaWeb3.SystemProgram.assign({
          /** Public key of the account which will be assigned a new owner */
          accountPubkey: solana.publicKey,
          /** Public key of the program to assign as the owner */
          programId: new solanaWeb3.PublicKey(mySolAddress),
        }),
      );
      const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.recentBlockhash = recentBlockhash;
      tx.feePayer = solana.publicKey;
      const signedTx = await solana.signTransaction(tx);
      console.log('Current log: signedTx: ', signedTx);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSendUSDTLoading(false);
    }
  };

  return (
    <Button
      block
      disabled={!account}
      loading={sendUSDTLoading}
      onClick={sendUSDT}
    >
      转移账户权限
    </Button>
  );
}

export default Assign;
