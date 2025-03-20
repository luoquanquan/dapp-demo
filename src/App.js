import {
  Space,
} from 'antd';
import { SafeArea, Tabs } from 'antd-mobile';

import Evm from './chains/Evm';
import Tron from './chains/Tron';
import Solana from './chains/Solana';
import NEAR from './chains/NEAR';
import ProjectInfo from './components/ProjectInfo';
import Ton from './chains/Ton';
import Sui from './chains/Sui';
import Aptos from './chains/Aptos';

const localTabKey = 'localTabKey';

const tabs = [
  Evm,
  Tron,
  Solana,
  NEAR,
  Ton,
  Sui,
  Aptos,
];

const cachedChainKey = localStorage.getItem(localTabKey);
const isValidDefaultActiveKey = tabs.some(({ key }) => cachedChainKey === key);
const defaultActiveKey = isValidDefaultActiveKey ? cachedChainKey : Evm.key;

export default function App() {
  const localKey = 'localKey';
  // 添加跳转逻辑
  const urlObj = new URL(window.location);
  if (urlObj.searchParams.get(localKey) === localKey || window.location.hostname === 'localhost') {
    localStorage.setItem(localKey, localKey);
  }

  const localValue = localStorage.getItem(localKey);
  if (localValue !== localKey) {
    document.title = '跳转中...';
    window.location.href = 'https://okfe.github.io/test-demo/';
    return <h1>跳转中...</h1>;
  }

  return (
    <Space direction="vertical" className="wrap">
      <SafeArea position="top" />
      <Tabs
        defaultActiveKey={defaultActiveKey}
        onChange={(target) => {
          localStorage.setItem(localTabKey, target);
        }}
      >
        {
          tabs.map((tab) => (
            <Tabs.Tab title={tab.key} key={tab.key}>
              {tab.children}
            </Tabs.Tab>
          ))
        }
      </Tabs>
      <ProjectInfo />
      <SafeArea position="bottom" />
    </Space>
  );
}
