import {
  Button, Card, Col, Row, Space, message,
} from 'antd';
import { useState } from 'react';

function SignTransaction({ account }) {
  const [splitUtxoLoading, setSplitUtxoLoading] = useState(false);
  const splitUtxo = async () => {
    try {
      setSplitUtxoLoading(true);
      const ret = await okxwallet.bitcoin.splitUtxo(
        {
          from: account,
          amount: 2,
        },
      );

      console.log('签名结果 : ', ret);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSplitUtxoLoading(false);
    }
  };

  return (
    <Card title="其他">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
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
