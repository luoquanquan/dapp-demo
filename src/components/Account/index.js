import { Card, Space } from 'antd';

export default function Account({ account, children }) {
  return (
    <Card title="当前连接账户">
      <Space direction="vertical">
        {account || '未连接'}
        {children}
      </Space>
    </Card>
  );
}
