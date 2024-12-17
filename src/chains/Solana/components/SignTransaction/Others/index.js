import { Col } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import { toastFail, toastSuccess } from '../../../../../utils/toast';
import { mySolAddress } from '../../../const';

function Others({ account, connection }) {
  const [assignLoading, setAssignLoading] = useState(false);
  const assign = async () => {
    try {
      setAssignLoading(true);
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
      toastFail();
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="Others">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={assignLoading}
            onClick={assign}
          >
            🔴 assign your account`s owner to me
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default Others;
