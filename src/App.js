import { useEffect } from 'react';
import {
  Space, Tabs, message,
} from 'antd';

import Evm from './chains/Evm';
import Tron from './chains/Tron';
import Solana from './chains/Solana';
import Aptos from './chains/Aptos';
import Sui from './chains/Sui';
import Stacks from './chains/Stacks';
import Starknet from './chains/Starknet';
import Cosmos from './chains/Cosmos';
import Bitcoin from './chains/Bitcoin';
// import NEAR from './chains/NEAR';
import ProjectInfo from './components/ProjectInfo';

const localTabKey = 'localTabKey';

const tabs = [
  Evm,
  Tron,
  Solana,
  Aptos,
  Cosmos,
  Sui,
  Bitcoin,
  Stacks,
  Starknet,
  // NEAR,
];

export default function App() {
  useEffect(() => {
    const reload = ((timer = null) => () => {
      if (timer) {
        return;
      }

      // eslint-disable-next-line
      timer = setTimeout(() => {
        timer = null;
        clearTimeout(timer);
        message.error('检测到钱包连接断开, 正在自动刷新 ~', 1, () => {
          window.location.reload();
        });
      }, 1e3);
    })();

    window.okxwallet?.on('disconnect', reload);
    return () => window.okxwallet?.off('disconnect', reload);
  }, []);

  return (
    <div className="wrap">
      <Space direction="vertical">
        <Tabs
          defaultActiveKey={localStorage.getItem(localTabKey) || Evm.key}
          items={tabs}
          onChange={(target) => {
            localStorage.setItem(localTabKey, target);
          }}
        />
        <ProjectInfo />
      </Space>
    </div>
  );
}
