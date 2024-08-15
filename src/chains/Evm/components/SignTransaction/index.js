import {
  Row, Space,
} from 'antd';
import { Card } from 'antd-mobile';
import NFT from './NFT';
import GasChecker from './GasChecker';
import BatchTransfer from './BatchTransfer';
import ERC20 from './ERC20';
import Form from './Form';

export default function SignTransaction() {
  return (
    <Card title="signTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <ERC20 />
          <NFT />
        </Row>
        <Row gutter={16}>
          <GasChecker />
          <BatchTransfer />
        </Row>
        <Row gutter={16}>
          <Form />
        </Row>
      </Space>
    </Card>
  );
}
