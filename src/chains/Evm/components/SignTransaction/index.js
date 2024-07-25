import {
  Card, Col, Row, Space,
} from 'antd';
import GasinfoConfig from './GasinfoConfig';
import CreateToken from './CreateToken';
import GrayAddress from './GrayAddress';
import NFT from './NFT';
import GasChecker from './GasChecker';
import BatchTransfer from './BatchTransfer';

export default function SignTransaction() {
  return (
    <Card title="合约交互">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <CreateToken />
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <NFT />
            </Space>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <GasChecker />
          </Col>
          <Col span={12}>
            <BatchTransfer />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <GrayAddress />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <GasinfoConfig />
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
