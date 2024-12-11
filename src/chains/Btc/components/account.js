import { Card, Space } from 'antd-mobile';

export default function Account({ account, publicKey }) {
  return (
    <Card title="Current connected account">
      <Space direction="vertical">
        Address:
        {' '}
        {account?.address?.toString() || '--'}
        <br />
        Public Key:
        {' '}
        {account?.publicKey || '--'}
        <br />
        Get Public Key:
        {publicKey || '--'}
      </Space>
    </Card>
  );
}
