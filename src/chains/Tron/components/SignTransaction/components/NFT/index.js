import {
  Col, Space, message,
} from 'antd';
import { Button, Card } from 'antd-mobile';
import { useState } from 'react';
import LinkButton from '../../../../../../components/LinkButton';
import { grayTronAddress, tronNFTAddress, myTronAddress } from '../../../../const';

function NFT({ account }) {
  const [approveFromLoading, setApproveLoading] = useState(false);
  const approve = (address = myTronAddress) => async () => {
    try {
      setApproveLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'uint256', value: 114035 }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronNFTAddress),
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

  const [setApprovalForAllLoading, setSetApprovalForAllLoading] = useState(false);
  const setApprovalForAll = (address = myTronAddress) => async () => {
    try {
      setSetApprovalForAllLoading(true);
      const parameter = [{ type: 'address', value: address }, { type: 'bool', value: true }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronNFTAddress),
        'setApprovalForAll(address,bool)',
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
      setSetApprovalForAllLoading(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="NFT 合集">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={setApprovalForAllLoading}
            onClick={setApprovalForAll()}
          >
            setApprovalForAll
          </Button>
          <Button
            block
            color="danger"
            disabled={!account}
            loading={setApprovalForAllLoading}
            onClick={setApprovalForAll(grayTronAddress)}
          >
            setApprovalForAll(gray)
          </Button>

          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve()}
          >
            approve(未解析)
          </Button>
          <Button
            block
            disabled={!account}
            loading={approveFromLoading}
            onClick={approve(grayTronAddress)}
          >
            approve(gray)(未解析)
          </Button>
          <LinkButton href="https://tronscan.org/#/token721/TDxkVPEaSNQkGb5HKmucMuLYbkZD3oWgUp/code">浏览器</LinkButton>
        </Space>
      </Card>
    </Col>
  );
}

export default NFT;
