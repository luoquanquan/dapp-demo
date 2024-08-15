import {
  Col, Space, message,
} from 'antd';
import { Button, Card } from 'antd-mobile';
import { useState } from 'react';
import {
  grayTronAddress, myTronAddress, okWeb3Address, tronStrongBlackEoaAddress, tronUSDTAddress,
} from '../../../../../../utils/const';
import LinkButton from '../../../../../../components/LinkButton';

function USDT({ account }) {
  const [increaseApprovalLoading, setIncreaseApprovalLoading] = useState(false);
  const increaseApproval = (address = okWeb3Address) => async () => {
    try {
      setIncreaseApprovalLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: tronWeb.toSun(99999999999999) }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDTAddress),
        'increaseApproval(address,uint256)',
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
      setIncreaseApprovalLoading(false);
    }
  };

  const [decreaseApprovalLoading, setDecreaseApprovalLoading] = useState(false);
  const decreaseApproval = (address = okWeb3Address) => async () => {
    try {
      setDecreaseApprovalLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: tronWeb.toSun(99999999999999) }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDTAddress),
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
      setDecreaseApprovalLoading(false);
    }
  };

  const [transferLoading, setTransferLoading] = useState(false);
  const transfer = (address = myTronAddress) => async () => {
    try {
      setTransferLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: 1 * 10 ** 3 }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDTAddress),
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
        tronWeb.address.toHex(tronUSDTAddress),
        'approve(address,uint256)',
        { feeLimit: 100000000 },
        parameter,
        tronWeb.address.toHex(account),
      );
      const signedTx = await tronWeb.trx.sign(transaction);
      console.log('Current log: signedTx: ', signedTx);
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
        tronWeb.address.toHex(tronUSDTAddress),
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
      <Card direction="vertical" title="USDT">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={increaseApprovalLoading}
            onClick={increaseApproval()}
          >
            increaseApproval
          </Button>
          <Button
            block
            color="danger"
            disabled={!account}
            loading={increaseApprovalLoading}
            onClick={increaseApproval(grayTronAddress)}
          >
            increaseApproval(gray)
          </Button>
          <Button
            block
            color="warning"
            disabled={!account}
            loading={increaseApprovalLoading}
            onClick={increaseApproval(myTronAddress)}
          >
            increaseApproval to EOA
          </Button>
          <Button
            block
            disabled={!account}
            loading={decreaseApprovalLoading}
            onClick={decreaseApproval()}
          >
            decreaseApproval
          </Button>
          <Button
            block
            disabled={!account}
            loading={decreaseApprovalLoading}
            onClick={decreaseApproval(grayTronAddress)}
          >
            decreaseApproval(gray)
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
            transfer Black Address
          </Button>
          <Button
            block
            color="danger"
            disabled={!account}
            loading={transferLoading}
            onClick={transfer(tronStrongBlackEoaAddress)}
          >
            transfer Strong Black Address
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
            approve Black Address
          </Button>
          <Button
            block
            color="danger"
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(tronStrongBlackEoaAddress)}
          >
            approve Strong Black Address
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

          <LinkButton href="https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/code">
            USDT Tron Scan
          </LinkButton>
        </Space>
      </Card>
    </Col>
  );
}

export default USDT;
