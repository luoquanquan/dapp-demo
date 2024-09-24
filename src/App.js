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

const localTabKey = 'localTabKey';

const tabs = [
  Evm,
  Tron,
  Solana,
  NEAR,
  Ton,
  TG,
];

export default function App() {
  return (
    <Space direction="vertical" className="wrap">
      <SafeArea position="top" />
      <Tabs
        defaultActiveKey={localStorage.getItem(localTabKey) || Evm.key}
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
