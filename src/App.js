import React from 'react';
import { Space } from 'antd';
import { SafeArea, Tabs } from 'antd-mobile';
import Connect from './Connect';
import Evm from './chains/Evm';
import Tron from './chains/Tron';
import Solana from './chains/Solana';
import NEAR from './chains/NEAR';
import ProjectInfo from './components/ProjectInfo';
import Ton from './chains/Ton';
import Sui from './chains/Sui';
import Aptos from './chains/Aptos';

const localTabKey = 'localTabKey';

const tabs = [Connect, Evm, Tron, Solana, NEAR, Ton, Sui, Aptos];
// const tabs = [Connect, Evm, Tron, NEAR, Aptos];

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
        {tabs.map((tab) => (
          <Tabs.Tab title={tab.key} key={tab.key}>
            {tab.children}
          </Tabs.Tab>
        ))}
      </Tabs>
      <ProjectInfo />
      <SafeArea position="bottom" />
    </Space>
  );
}
