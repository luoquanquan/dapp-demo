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
import TG from './chains/TG';
import Sui from './chains/Sui';

const localTabKey = 'localTabKey';

const tabs = [
  Evm,
  Tron,
  Solana,
  NEAR,
  Ton,
  TG,
  Sui,
];

const cachedChainKey = localStorage.getItem(localTabKey);
const isValidDefaultActiveKey = tabs.some(({ key }) => cachedChainKey === key);
const defaultActiveKey = isValidDefaultActiveKey ? cachedChainKey : Evm.key;

export default function App() {
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
