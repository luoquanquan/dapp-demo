import { Card, Space } from 'antd-mobile';

export default function Account({ account, publicKey }) {
  return (
    <Card title="Current connected account">
      <Space direction="vertical">
        Address:
        {' '}
        {account || '--'}
        <br />
        Public Key:
        {' '}
        {publicKey || '--'}
      </Space>
    </Card>
  );
}
