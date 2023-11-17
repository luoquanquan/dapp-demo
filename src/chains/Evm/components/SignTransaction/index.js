import { Card, Row, Space } from 'antd';
import CreateToken from './CreateToken';

export default function SignTransaction() {
  return (
    <Card title="合约交互">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <CreateToken />
        </Row>
      </Space>
    </Card>
  );
}
