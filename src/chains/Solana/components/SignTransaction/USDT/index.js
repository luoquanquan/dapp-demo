import { useState } from 'react';
import { Button, Card, Space } from 'antd-mobile';
import * as solanaWeb3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { Col } from 'antd';
import { toastFail, toastSuccess } from '../../../../../utils/toast';
import {
  blackAddress, mySolAddress, strongBlackAddress, USDTAddress,
} from '../../../const';

const appendBaseTransactionParams = async ({ transaction, connection, wallet }) => {
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.recentBlockhash = recentBlockhash;
  transaction.feePayer = wallet.publicKey;
};

const generateTokenInfo = async ({ account, toAddress }) => {
  const fromPubkey = new solanaWeb3.PublicKey(account);
  const toPubkey = new solanaWeb3.PublicKey(toAddress);
  const tokenProgramId = new solanaWeb3.PublicKey(USDTAddress);
  const fromAddrAccount = await splToken.getAssociatedTokenAddress(
    tokenProgramId,
    fromPubkey,
  );

  const toAddrAccount = await splToken.getAssociatedTokenAddress(
    tokenProgramId,
    toPubkey,
  );

  return {
    fromAddrAccount,
    fromPubkey,
    toAddrAccount,
    toPubkey,
    tokenProgramId,
  };
};

const generateTransferInstruction = async ({ account, toAddress, amount = 100 }) => {
  const {
    fromAddrAccount,
    fromPubkey,
    toAddrAccount,
  } = await generateTokenInfo({ account, toAddress });

  return splToken.createTransferInstruction(
    fromAddrAccount,
    toAddrAccount,
    fromPubkey,
    amount,
  );
};

const generateApproveInstruction = async ({ account, toAddress, amount = 10000000 }) => {
  // USDT`s decimals is 6
  const decimals = 6;

  const {
    fromAddrAccount,
    fromPubkey,
    toAddrAccount,
    tokenProgramId,
  } = await generateTokenInfo({ account, toAddress });

  return splToken.createApproveCheckedInstruction(
    fromAddrAccount,
    tokenProgramId,
    // new solanaWeb3.PublicKey(toAddress),
    toAddrAccount,
    fromPubkey,
    amount,
    decimals,
  );
};

function USDT({ account, connection, wallet }) {
  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = ({ toAddress = mySolAddress, amount } = {}) => async () => {
    try {
      setTransferLoading(true);
      // init a transaction interface
      const transaction = new solanaWeb3.Transaction();

      const transferInstruction = await generateTransferInstruction({ account, toAddress, amount });
      transaction.add(transferInstruction);

      await appendBaseTransactionParams({ transaction, connection, wallet });

      // sign
      const signedTx = await wallet.signTransaction(transaction);
      console.log(signedTx);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setTransferLoading(false);
    }
  };

  const [approveLoading, setApproveLoading] = useState(false);
  const approve = ({ toAddress = 'GokA1R67GqSavkd15zR62QD68Tuc5AEfvjssntVDEbM8', amount } = {}) => async () => {
    try {
      setApproveLoading(true);

      const transaction = new solanaWeb3.Transaction();

      const approveInstruction = await generateApproveInstruction({ account, toAddress, amount });
      transaction.add(approveInstruction);

      await appendBaseTransactionParams({ transaction, connection, wallet });

      // sign
      const signedTx = await wallet.signTransaction(transaction);
      console.log(signedTx);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setApproveLoading(false);
    }
  };

  const [transferAndApproveLoading, setTransferAndApprove] = useState(false);
  const transferAndApprove = ({ toAddress = mySolAddress, amount } = {}) => async () => {
    try {
      setTransferAndApprove(true);

      const transaction = new solanaWeb3.Transaction();

      const transferInstruction = await generateTransferInstruction({ account, toAddress });
      transaction.add(transferInstruction);
      const approveInstruction = await generateApproveInstruction({ account, toAddress, amount });
      transaction.add(approveInstruction);

      await appendBaseTransactionParams({ transaction, connection, wallet });

      // sign
      const signedTx = await wallet.signTransaction(transaction);
      console.log(signedTx);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setTransferAndApprove(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="USDT">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={transferLoading}
            onClick={transfer()}
          >
            transfer
          </Button>

          <Button
            block
            disabled={!account}
            loading={transferLoading}
            onClick={transfer({ amount: 1000000000000 })}
          >
            transfer failed
          </Button>

          <Button
            block
            disabled={!account}
            loading={transferAndApproveLoading}
            onClick={transferAndApprove()}
          >
            transfer & approve
          </Button>

          <Button
            block
            disabled={!account}
            loading={transferAndApproveLoading}
            onClick={transferAndApprove({ amount: 0 })}
          >
            transfer & revoke
          </Button>

          <Button
            block
            disabled={!account}
            loading={approveLoading}
            onClick={approve()}
          >
            approve
          </Button>

          <Button
            block
            disabled={!account}
            loading={approveLoading}
            onClick={approve({ amount: 0 })}
          >
            revoke
          </Button>

          <Button
            block
            color="danger"
            disabled={!account}
            loading={approveLoading}
            onClick={approve({ toAddress: blackAddress })}
          >
            approve to blackAddress
          </Button>

          <Button
            block
            color="danger"
            disabled={!account}
            loading={approveLoading}
            onClick={approve({ toAddress: strongBlackAddress })}
          >
            approve to strongBlackAddress
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default USDT;
