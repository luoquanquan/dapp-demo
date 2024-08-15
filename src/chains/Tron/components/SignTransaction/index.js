import {
  Row, Space,
} from 'antd';
import { Card } from 'antd-mobile';
import USDT from './components/USDT';
import USDC from './components/USDC';
import NFT from './components/NFT';
import Others from './components/Others';

export default function SignTransaction({ account }) {
  return (
    <Card title="signTransaction">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={6}>
          <USDT account={account} />
          <USDC account={account} />
          <NFT account={account} />
          <Others account={account} />
        </Row>
      </Space>
    </Card>
  );
}
