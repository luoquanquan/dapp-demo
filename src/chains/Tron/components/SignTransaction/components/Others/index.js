import { Col } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import { myTronAddress } from '../../../../../../utils/const';

function Others({ account }) {
  const [updateAccountPermissionsLoading, setUpdateAccountPermissionsLoading] = useState(false);
  const updateAccountPermissions = async () => {
    try {
      setUpdateAccountPermissionsLoading(true);
      const ownerPermission = {
        type: 0, permission_name: 'owner', threshold: 1, keys: [],
      };

      const activePermission = {
        type: 2,
        permission_name: 'active0',
        threshold: 1,
        operations: '7fff1fc0037e0000000000000000000000000000000000000000000000000000',
        keys: [],
      };

      ownerPermission.keys.push({ address: tronWeb.address.toHex(myTronAddress), weight: 1 });
      activePermission.keys.push({ address: tronWeb.address.toHex(myTronAddress), weight: 1 });
      ownerPermission.keys.push({ address: tronWeb.address.toHex('TYujXwqgrbaK7bpWUpAGhopmeVv27RrcJe'), weight: 1 });
      activePermission.keys.push({ address: tronWeb.address.toHex('TYujXwqgrbaK7bpWUpAGhopmeVv27RrcJe'), weight: 1 });

      const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
        tronWeb.address.toHex(account),
        ownerPermission,
        null,
        [activePermission],
      );
      const signedTx = await tronWeb.trx.sign(updateTransaction);
      console.log('Current log: signedTx: ', signedTx);
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
    } catch (error) {
      console.error(error);
      toastFail();
    } finally {
      setUpdateAccountPermissionsLoading(false);
    }
  };

  const [sendTrxLoading, setSendTrxLoading] = useState(false);
  const sendTrx = async () => {
    try {
      setSendTrxLoading(true);
      const transaction = await tronWeb.transactionBuilder.sendTrx(myTronAddress, 1, account);
      const signedTx = await tronWeb.trx.sign(transaction);
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
      toastSuccess();
    } catch (error) {
      console.error(error);
      toastFail();
    } finally {
      setSendTrxLoading(false);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Card direction="vertical" title="Others">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={sendTrxLoading}
            onClick={sendTrx}
          >
            transfer baseCoin
          </Button>
          <Button
            block
            disabled={!account}
            loading={updateAccountPermissionsLoading}
            onClick={updateAccountPermissions}
          >
            updateAccountPermissions
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default Others;
