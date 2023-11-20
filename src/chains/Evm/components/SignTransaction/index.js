import { Card, Row, Space } from 'antd';
import CreateToken from './CreateToken';
import GrayAddress from './GrayAddress';
import NFT from './NFT';

export default function SignTransaction() {
  return (
    <Card title="合约交互">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <CreateToken />
          <NFT />
        </Row>
        <Row gutter={16}>
          <GrayAddress />
        </Row>
      </Space>
    </Card>
  );
}
