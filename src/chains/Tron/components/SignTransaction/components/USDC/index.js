import {
  Button, Card, Col, Space, message,
} from 'antd';
import { useState } from 'react';
import {
  grayTronAddress, myTronAddress, tronUSDCAddress,
} from '../../../../../../utils/const';

function USDC({ account }) {
  const [increaseAllowanceLoading, setIncreaseAllowanceLoading] = useState(false);
  const increaseAllowance = (address = myTronAddress) => async () => {
    try {
      setIncreaseAllowanceLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: tronWeb.toSun(99999999999999) }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDCAddress),
        'increaseAllowance(address,uint256)',
        { feeLimit: 100000000 },
        parameter,
        tronWeb.address.toHex(account),
      );
      const signedTx = await tronWeb.trx.sign(transaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setIncreaseAllowanceLoading(false);
    }
  };

  const [decreaseAllowanceLoading, setDecreaseAllowanceLoading] = useState(false);
  const decreaseAllowance = (address = myTronAddress) => async () => {
    try {
      setDecreaseAllowanceLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: tronWeb.toSun(99999999999999) }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDCAddress),
        'decreaseAllowance(address,uint256)',
        { feeLimit: 100000000 },
        parameter,
        tronWeb.address.toHex(account),
      );
      const signedTx = await tronWeb.trx.sign(transaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setDecreaseAllowanceLoading(false);
    }
  };

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = (address = myTronAddress) => async () => {
    try {
      setTransferLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: 1 * 10 ** 3 }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDCAddress),
        'transfer(address,uint256)',
        { feeLimit: 100000000 },
        parameter,
        tronWeb.address.toHex(account),
      );
      const signedTx = await tronWeb.trx.sign(transaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setTransferLoading(false);
    }
  };

  const [approveFromLoading, setApproveLoading] = useState(false);
  const approve = (address = myTronAddress, value = 1 * 10 ** 3) => async () => {
    try {
      setApproveLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDCAddress),
        'approve(address,uint256)',
        { feeLimit: 100000000 },
        parameter,
        tronWeb.address.toHex(account),
      );
      const signedTx = await tronWeb.trx.sign(transaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setApproveLoading(false);
    }
  };

  const [transferFromLoading, setTransferFromLoading] = useState(false);
  const transferFrom = (address = myTronAddress) => async () => {
    try {
      setTransferFromLoading(true);
      const parameter = [{ type: 'address', value: account }, { type: 'address', value: address }, { type: 'uint256', value: 1 * 10 ** 3 }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDCAddress),
        'transferFrom(address,address,uint256)',
        { feeLimit: 100000000 },
        parameter,
        tronWeb.address.toHex(account),
      );
      const signedTx = await tronWeb.trx.sign(transaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setTransferFromLoading(false);
    }
  };

  return (
    <Col span={6}>
      <Card direction="vertical" title="USDC">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={increaseAllowanceLoading}
            onClick={increaseAllowance()}
          >
            increaseAllowance
          </Button>
          <Button
            block
            disabled={!account}
            loading={increaseAllowanceLoading}
            onClick={increaseAllowance(grayTronAddress)}
          >
            increaseAllowance(gray)
          </Button>

          <Button
            block
            disabled={!account}
            loading={decreaseAllowanceLoading}
            onClick={decreaseAllowance()}
          >
            decreaseAllowance
          </Button>
          <Button
            block
            disabled={!account}
            loading={decreaseAllowanceLoading}
            onClick={decreaseAllowance(grayTronAddress)}
          >
            decreaseAllowance(gray)
          </Button>

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
            onClick={transfer(grayTronAddress)}
          >
            transfer(gray)
          </Button>

          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve()}
          >
            approve
          </Button>
          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(grayTronAddress)}
          >
            approve(gray)
          </Button>

          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(myTronAddress, 0)}
          >
            revoke
          </Button>
          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(grayTronAddress, 0)}
          >
            revoke(gray)
          </Button>

          <Button
            block
            disabled={!account}
            loading={transferFromLoading}
            onClick={transferFrom()}
          >
            transferFrom
          </Button>
          <Button
            block
            disabled={!account}
            loading={transferFromLoading}
            onClick={transferFrom(grayTronAddress)}
          >
            transferFrom(gray)
          </Button>

          <Button block type="link" href="https://tronscan.org/#/token20/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8/code">USDC 浏览器</Button>
        </Space>
      </Card>
    </Col>

  );
}

export default USDC;
