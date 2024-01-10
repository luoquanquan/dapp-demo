import { Card, Descriptions } from 'antd';

function ProjectInfo() {
  const githubUrl = 'https://github.com/luoquanquan/dapp-demo';
  const networkInfos = [
    {
      key: 'github',
      label: 'github',
      children: <a href="githubUrl">{githubUrl}</a>,
    },
  ];

  return (
    <Card title="项目信息">
      <Descriptions layout="vertical" items={networkInfos} />
    </Card>
  );
}

export default ProjectInfo;
