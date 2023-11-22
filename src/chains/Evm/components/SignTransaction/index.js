import {
  Card, Col, Row, Space,
} from 'antd';
import CreateToken from './CreateToken';
import GrayAddress from './GrayAddress';
import NFT from './NFT';

export default function SignTransaction() {
  return (
    <Card title="合约交互">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <CreateToken />
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <NFT />
              <GrayAddress />
            </Space>
          </Col>

        </Row>
        <Row gutter={16} />
      </Space>
    </Card>
  );
}
