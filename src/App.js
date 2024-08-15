import {
  Space,
} from 'antd';
import { SafeArea, Tabs } from 'antd-mobile';

import Evm from './chains/Evm';
import Tron from './chains/Tron';
import Solana from './chains/Solana';
import Aptos from './chains/Aptos';
// import Sui from './chains/Sui';
// import Stacks from './chains/Stacks';
// import Starknet from './chains/Starknet';
import Cosmos from './chains/Cosmos';
import Bitcoin from './chains/Bitcoin';
import NEAR from './chains/NEAR';
import ProjectInfo from './components/ProjectInfo';
import Ton from './chains/Ton';

const localTabKey = 'localTabKey';

const tabs = [
  Evm,
  Tron,
  Solana,
  Aptos,
  Cosmos,
  // Sui,
  Bitcoin,
  // Stacks,
  // Starknet,
  NEAR,
  Ton,
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
