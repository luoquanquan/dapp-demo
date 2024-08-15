import {
  Col, Space, message,
} from 'antd';
import { Button, Card } from 'antd-mobile';
import { useState } from 'react';
import {
  grayTronAddress, myTronAddress, okWeb3Address, tronUSDCAddress,
} from '../../../../../../utils/const';
import LinkButton from '../../../../../../components/LinkButton';

function USDC({ account }) {
  const [increaseAllowanceLoading, setIncreaseAllowanceLoading] = useState(false);
  const increaseAllowance = (address = okWeb3Address) => async () => {
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
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setIncreaseAllowanceLoading(false);
    }
  };

  const [decreaseAllowanceLoading, setDecreaseAllowanceLoading] = useState(false);
  const decreaseAllowance = (address = okWeb3Address) => async () => {
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
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
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
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setTransferLoading(false);
    }
  };

  const [approveFromLoading, setApproveLoading] = useState(false);
  const approve = (address = okWeb3Address, value = 1 * 10 ** 3) => async () => {
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
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
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
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setTransferFromLoading(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
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
            color="danger"
            disabled={!account}
            loading={increaseAllowanceLoading}
            onClick={increaseAllowance(grayTronAddress)}
          >
            increaseAllowance(gray)
          </Button>
          <Button
            block
            color="warning"
            disabled={!account}
            loading={increaseAllowanceLoading}
            onClick={increaseAllowance(myTronAddress)}
          >
            increaseAllowance to EOA
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
            color="danger"
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
            color="danger"
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(grayTronAddress)}
          >
            approve(gray)
          </Button>
          <Button
            block
            color="warning"
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(myTronAddress)}
          >
            approve to EOA
          </Button>
          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(okWeb3Address, 0)}
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
            color="danger"
            disabled={!account}
            loading={transferFromLoading}
            onClick={transferFrom(grayTronAddress)}
          >
            transferFrom(gray)
          </Button>
          <LinkButton href="https://tronscan.org/#/token20/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8/code">USDC Tron Scan</LinkButton>
        </Space>
      </Card>
    </Col>

  );
}

export default USDC;
