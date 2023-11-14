import { Card, Descriptions } from 'antd';

export default function Network({ chainId, account, network }) {
  const networkInfos = [
    {
      key: 'Network',
      label: 'Network',
      children: network,
    },
    {
      key: 'ChainId',
      label: 'ChainId',
      children: chainId,
    },
  ];

  return (
    <Card title="网络信息">
      <Descriptions items={networkInfos} />
    </Card>
  );
}
