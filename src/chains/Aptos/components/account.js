import { Card, Space } from 'antd-mobile';

export default function Account({ account, children }) {
  return (
    <Card title="Current connected account">
      <Space direction="vertical">
        {account || '--'}
        {children}
      </Space>
    </Card>
  );
}
