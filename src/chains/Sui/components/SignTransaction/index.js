import { Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import { Button, Card, Space } from 'antd-mobile';
import { useState, useEffect } from 'react';
import { useCurrentWallet } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { message } from 'antd';

function SignTransaction() {
  const wallet = useCurrentWallet();
  console.log('wallets', wallet);
  const address = window?.sui?.getAccount()?.address;

  const [smLoading, setSmLoading] = useState(false);
  const [spmLoading, setSpmLoading] = useState(false);
  const [stxLoading, setStxLoading] = useState(false);
  const [sAndExeTxLoading, setSAndExeTxLoading] = useState(false);

  const signMessage = async () => {
    setSmLoading(true);
    try {
      const res = await window.sui.signMessage({
        message: new Uint8Array([
          76, 111, 103, 105, 110, 32, 119, 105, 116, 104, 32, 66, 108, 117, 101,
          109, 111, 118, 101,
        ]),
      });
      console.log('sssssssssssssssui sm res', res);
      message.success('success to signMessage');
    } catch (error) {
      console.log('ssssssssssssssui sm error', error);
      message.error('error to signMessage');
    } finally {
      setSmLoading(false);
    }
  };
  const signPersonalMessage = async () => {
    setSpmLoading(true);
    try {
      const res = await window.sui.signPersonalMessage({
        message: new Uint8Array([
          76, 111, 103, 105, 110, 32, 119, 105, 116, 104, 32, 66, 108, 117, 101,
          109, 111, 118, 101,
        ]),
      });
      console.log('sssssssssssssui spm res', res);
      message.success('success to signPersonalMessage');
    } catch (error) {
      message.error('error to signPersonalMessage');

      console.log('sssssssssssssui spm error', error);
    } finally {
      setSpmLoading(false);
    }
  };
  const signTransaction = async () => {
    try {
      setStxLoading(true);
      // 创建 TransactionBlock 对象
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [1000]);
      tx.transferObjects(
        [coin],
        '0x791e21d7d3cc6ecd6f748bb0961380510851e99a7de26eeb29778a24334cb2eb',
      );

      const res = await window.sui.signTransactionBlock({
        transactionBlock: tx,
      });
      console.log('sssssssssssssssui stx res', res);
      message.success('success to sign transaction');
    } catch (error) {
      message.error('fail to sign transaction');

      console.log('ssssssssssui stx error', error);
    } finally {
      setStxLoading(false);
    }
  };
  const signAndExecuteTransaction = async () => {
    try {
      setSAndExeTxLoading(true);
      // 创建 TransactionBlock 对象
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [1000]);
      tx.transferObjects(
        [coin],
        '0x791e21d7d3cc6ecd6f748bb0961380510851e99a7de26eeb29778a24334cb2eb',
      );
      const res = await window.sui.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      message.success('success to signAndExecute transaction');

      console.log('ssssssssssui stx res', res);
    } catch (error) {
      console.log('sssssssssssui stx error', error);
      message.error('error to signAndExecute transaction');
    } finally {
      setSAndExeTxLoading(false);
    }
  };
  const [account, setAccount] = useState('');
  useEffect(() => {
    if (window.sui) {
      sui.on('accountChanged', (accountInfo) => {
        console.log('ssssssssssssssssui accountChanged', accountInfo);
      });
      sui.on('connect', (accountInfo) => {
        console.log('sssssssssssui connect: ', accountInfo);
        if (accountInfo) {
          setAccount(accountInfo?.address);
          // const formatSuiPublicKey = (pbk) => {
          //   console.log('pbk', pbk);
          //   console.log(
          //     '字符串 公钥 是否相等',
          //     new Ed25519PublicKey(pbk).toBase64() ===
          //       '5xjVmGap6wC+Of2GFy1VlOdFY9Qq2QMOs4UHe0JYXMg=',
          //   );

          //   console.log(
          //     'address 等于 bytes公钥生产的地址？',
          //     accountInfo?.address === new Ed25519PublicKey(pbk).toSuiAddress(),
          //   );
          // };
          // formatSuiPublicKey(accountInfo?.publicKey);
        }
      });
      sui.on('chainChanged', (data) => {
        console.log('sssssssssssui chainChanged: ', data);
      });
      sui.on('disconnect', (data) => {
        console.log('ssssssssui disconnect: ', data);
        setAccount('');
      });
      sui.on('change', (data) => {
        console.log('ssssssssui change event: ', data);
      });
    }
  }, []);
  useEffect(() => {}, []);
  return (
    <Card title="SignTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        {account && (
          <div>
            account:
            {account}
          </div>
        )}
        <Button
          block
          disabled={!address}
          loading={smLoading}
          onClick={signMessage}
        >
          signMessage
        </Button>
        <Button
          block
          disabled={!address}
          loading={spmLoading}
          onClick={signPersonalMessage}
        >
          signPersonalMessage
        </Button>
        <Button
          block
          disabled={!address}
          loading={stxLoading}
          onClick={signTransaction}
        >
          signTransaction
        </Button>
        <Button
          block
          disabled={!address}
          loading={sAndExeTxLoading}
          onClick={signAndExecuteTransaction}
        >
          signAndExecuteTransaction
        </Button>
      </Space>
    </Card>
  );
}

export default SignTransaction;
