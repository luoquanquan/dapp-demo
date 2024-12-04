import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import { useCurrentWallet } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js';

function SignTransaction() {
  const wallet = useCurrentWallet();
  console.log('wallets', wallet);
  const address = window.sui.getAccount()?.address;

  const [smLoading, setSmLoading] = useState(false);
  const [spmLoading, setSpmLoading] = useState(false);
  const [stxLoading, setStxLoading] = useState(false);
  const [sAndExeTxLoading, setSAndExeTxLoading] = useState(false);

  const signMessage = async () => {
    setSmLoading(true);
    try {
      const res = await window.sui.signMessage({
        message: new Uint8Array([76, 111, 103, 105, 110, 32, 119, 105, 116, 104, 32, 66, 108, 117, 101, 109, 111, 118, 101]),
      });
      console.log('sui sm res', res);
    } catch (error) {
      console.log('sui sm error', error);
    } finally {
      setSmLoading(false);
    }
  };
  const signPersonalMessage = async () => {
    setSpmLoading(true);
    try {
      const res = await window.sui.signPersonalMessage({
        message: new Uint8Array([76, 111, 103, 105, 110, 32, 119, 105, 116, 104, 32, 66, 108, 117, 101, 109, 111, 118, 101]),
      });
      console.log('sui spm res', res);
    } catch (error) {
      console.log('sui spm error', error);
    } finally {
      setSpmLoading(false);
    }
  };
  const signTransaction = async () => {
    try {
      setStxLoading(true);
      // 创建 TransactionBlock 对象
      const transaction = new TransactionBlock();

      // 添加转账操作
      transaction.addTransferSui({
        recipient: '0x791e21d7d3cc6ecd6f748bb0961380510851e99a7de26eeb29778a24334cb2eb', // 接收方地址
        amount: 1000000, // 转账金额（单位：MIST，1 SUI = 1e9 MIST）
      });
      const res = await window.sui.signTransaction({
        transactionBlock: transaction,
      });
      console.log('sui stx res', res);
    } catch (error) {
      console.log('sui stx error', error);
    } finally {
      setStxLoading(false);
    }
  };
  const signAndExecuteTransaction = async () => {
    try {
      setSAndExeTxLoading(true);
      // 创建 TransactionBlock 对象
      const transaction = new TransactionBlock();

      // 添加转账操作
      transaction.addTransferSui({
        recipient: '0x791e21d7d3cc6ecd6f748bb0961380510851e99a7de26eeb29778a24334cb2eb', // 接收方地址
        amount: 1000000, // 转账金额（单位：MIST，1 SUI = 1e9 MIST）
      });
      const res = await window.sui.signAndExecuteTransaction({
        transactionBlock: transaction,
      });
      console.log('sui stx res', res);
    } catch (error) {
      console.log('sui stx error', error);
    } finally {
      setSAndExeTxLoading(false);
    }
  };
  return (
    <Card title="SignTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button block disabled={!address} loading={smLoading} onClick={signMessage}>
          signMessage
        </Button>
        <Button block disabled={!address} loading={spmLoading} onClick={signPersonalMessage}>
          signPersonalMessage
        </Button>
        <Button block disabled={!address} loading={stxLoading} onClick={signTransaction}>
          signTransaction
        </Button>
        <Button block disabled={!address} loading={sAndExeTxLoading} onClick={signAndExecuteTransaction}>
          signAndExecuteTransaction
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransaction;
