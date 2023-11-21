import { Card, Descriptions } from 'antd';

function ProjectInfo() {
  const networkInfos = [
    {
      key: 'github',
      label: 'github',
      children: <a href="https://github.com/luoquanquan/multi-chain-test-dapp">https://github.com/luoquanquan/multi-chain-test-dapp</a>,
    },
  ];

  return (
    <Card title="项目信息">
      <Descriptions layout="vertical" items={networkInfos} />
    </Card>
  );
}

export default ProjectInfo;
