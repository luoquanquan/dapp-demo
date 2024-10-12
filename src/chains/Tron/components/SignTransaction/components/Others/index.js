import { Col } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import { toastFail, toastSuccess } from '../../../../../../utils/toast';
import { myTronAddress } from '../../../../const';

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

  const [passInvalidParamsLoading, setPassInvalidParamsLoading] = useState(false);
  const passInvalidParams = async () => {
    try {
      setPassInvalidParamsLoading(true);
      const signedTx = await tronWeb.trx.sign({
        visible: false,
        txID: '1215a31320030d16f8bc047c818dc6e9d5e345fd906de6dd8e4deec735aa88b0',
        raw_data: {
          contract: [
            // {
            //   parameter: {
            //     value: {
            //       data: '095ea7b300000000000000000000000051b160bb02261c822b33e61c6b947f275144545e00000000000000000000000000000000000000000000000000000000000003e8',
            //       owner_address: '4174abc9551f8612370c9d7b29b03f661254385a9a',
            //       contract_address: '41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
            //     },
            //     type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
            //   },
            //   type: 'TriggerSmartContract',
            // },
          ],
          ref_block_bytes: 'f639',
          ref_block_hash: '098e286d200aec9d',
          expiration: 1724298690000,
          fee_limit: 100000000,
          timestamp: 1724298632603,
        },
        raw_data_hex: '0a02f6392208098e286d200aec9d40d0fbd7c197325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a154174abc9551f8612370c9d7b29b03f661254385a9a121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244095ea7b300000000000000000000000051b160bb02261c822b33e61c6b947f275144545e00000000000000000000000000000000000000000000000000000000000003e8709bbbd4c19732900180c2d72f',
      });
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
      toastSuccess();
    } catch (error) {
      console.error(error);
      toastFail();
    } finally {
      setPassInvalidParamsLoading(false);
    }
  };

  const [notSameParamsTxLoading, setNotSameParamsTxLoading] = useState(false);
  const notSameParamsTx = async () => {
    try {
      setNotSameParamsTxLoading(true);
      const signedTx = await tronWeb.trx.sign({
        visible: false,
        txID: '1215a31320030d16f8bc047c818dc6e9d5e345fd906de6dd8e4deec735aa88b0',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: '0xa9059cbb00000000000000000000000071bb98dcb405c17b29606535557d45c04268df6b000000000000000000000000000000000000000000000000000000003b9aca00',
                  owner_address: '4174abc9551f8612370c9d7b29b03f661254385a9a',
                  contract_address: '41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: 'f639',
          ref_block_hash: '098e286d200aec9d',
          expiration: 1724298690000,
          fee_limit: 100000000,
          timestamp: 1724298632603,
        },
        raw_data_hex: '0a0242fc2208f3ff07a6b20a7b0640e8fcbd909c325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541cb3966acc1d471ad25e52330d6dea71c00fa1ab8121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244d73dd6230000000000000000000000003487b63d30b5b2c87fb7ffa8bcfade38eaac1abe0000000000000000000000000000000000000000000000000000000005f5e10070cbb4ba909c32900180c2d72f',
      });
      // await tronWeb.trx.sendRawTransaction(signedTx);
      console.log('Current log: signedTx: ', signedTx);
      toastSuccess();
    } catch (error) {
      console.error(error);
      toastFail();
    } finally {
      setNotSameParamsTxLoading(false);
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
          <Button
            block
            disabled={!account}
            loading={passInvalidParamsLoading}
            onClick={passInvalidParams}
          >
            signTransaction with inValid params
          </Button>
          <Button
            block
            disabled={!account}
            loading={notSameParamsTxLoading}
            onClick={notSameParamsTx}
          >
            notSameParamsTx
          </Button>
        </Space>
      </Card>
    </Col>
  );
}

export default Others;
