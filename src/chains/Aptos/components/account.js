import { Card, Space } from 'antd-mobile';

export default function Account({ account, children }) {
  return (
    <Card title="Current connected account">
      <Space direction="vertical">
        Address:
        {' '}
        {account.address.toString() || '--'}
        <br />
        Public Key:
        {' '}
        {account.publicKey || '--'}
        {children}
      </Space>
    </Card>
  );
}
