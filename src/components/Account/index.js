import { Card } from 'antd';

export default function Account({ account }) {
  return (
    <Card title="当前连接账户">
      {account || '未连接'}
    </Card>
  );
}
