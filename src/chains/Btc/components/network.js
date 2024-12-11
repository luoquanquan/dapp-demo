import { Card } from 'antd-mobile';

export default function Network({ chain }) {
  return (
    <Card title="Current network info">
      Current Chain:
      {' '}
      { chain }
    </Card>
  );
}
