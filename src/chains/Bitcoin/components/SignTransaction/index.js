import {
  Col, Row,
} from 'antd';
import {
  Button, Card, Space,
} from 'antd-mobile';
import { useState } from 'react';
import { toastFail, toastSuccess } from '../../../../utils/toast';

function SignTransaction({ account }) {
  const [splitUtxoLoading, setSplitUtxoLoading] = useState(false);
  const splitUtxo = async () => {
    try {
      setSplitUtxoLoading(true);
      await okxwallet.bitcoin.splitUtxo(
        {
          from: account,
          amount: 2,
        },
      );

      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSplitUtxoLoading(false);
    }
  };

  return (
    <Card title="其他">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Button
              block
              disabled={!account}
              onClick={splitUtxo}
              loading={splitUtxoLoading}
            >
              splitUtxo
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}

export default SignTransaction;
