import {
  Alert,
  Button, Card, Space, message,
} from 'antd';
import { useState } from 'react';

function SignTransaction({ account }) {
  const [signTxRet, setSignTxRet] = useState('');

  const handleSignTx = async () => {
    try {
      const transaction = {
        stxAddress: account,
        txType: 'contract_call',
        contractName: 'amm-swap-pool-v1-1',
        contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
        functionName: 'swap-helper',
        functionArgs: [
          '0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d0a746f6b656e2d77737478',
          '0616e685b016b3b6cd9ebf35f38e5ae29392e2acd51d176167653030302d676f7665726e616e63652d746f6b656e',
          '0100000000000000000000000005f5e100',
          '01000000000000000000000000000f4240',
          '0a010000000000000000000000000078b854',
        ],
        postConditionMode: 2,
        postConditions: [
          '000216c03b5520cf3a0bd270d8e41e5e19a464aef6294c010000000000002710',
          '010316e685b016b3b6cd9ebf35f38e5ae29392e2acd51d0f616c65782d7661756c742d76312d3116e685b016b3b6cd9ebf35f38e5ae29392e2acd51d176167653030302d676f7665726e616e63652d746f6b656e04616c657803000000000078b854',
        ],
        anchorMode: 3,
      };
      const { txHash, signature } = await window.stacks.signTransaction(transaction);
      // eslint-disable-next-line no-console
      console.log({ txHash, signature });
      setSignTxRet(signature);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card title="合约交互 (signTransaction)">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button disabled={!account} block onClick={handleSignTx}>signTransaction</Button>
            <Alert
              type="warning"
              message="Result"
              description={signTxRet}
            />
          </Space>
        </Card>
      </Space>
    </Card>
  );
}

export default SignTransaction;
