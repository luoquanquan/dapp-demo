import { Card } from 'antd-mobile';

function ProjectInfo() {
  if (process.env.NODE_ENV === 'development') return null;
  if (window.location.hostname !== 'luoquanquan.github.io') return null;

  // const githubUrl = `/dapp-demo/${process.env.REACT_APP_PACKAGE_VERSION}.zip`;

  return (
    <Card title="项目信息">
      <div>
        version:
        {process.env.REACT_APP_PACKAGE_VERSION}
      </div>
      {/* <a href={githubUrl}>下载代码包 </a>
      之后, 本地使用 live-server 托管即可在本地运行本项目,
      <a href="https://handle-note-img.niubishanshan.top/run-locally.gif" target="_blank" rel="noreferrer">操作视频</a> */}
    </Card>
  );
}

export default ProjectInfo;
