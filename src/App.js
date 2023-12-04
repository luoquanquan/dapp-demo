/* eslint-disable no-param-reassign */
import { useEffect } from 'react';
import {
  Alert, Space, Tabs, message,
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
import ProjectInfo from './components/ProjectInfo';

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
];

export default function App() {
  useEffect(() => {
    const reload = ((timer = null) => () => {
      if (timer) {
        return;
      }

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
      {
        window.okxwallet
          ? (
            <Space direction="vertical">
              <Tabs defaultActiveKey="Evm" items={tabs} />
              <ProjectInfo />
            </Space>
          )
          : (
            <Alert
              style={{ marginTop: '100px' }}
              message="请安装 okx wallet 再测试"
              description="此工具仅用于 okxwallet 调试, 请先安装 okxwallet"
              type="error"
            />
          )
      }
    </div>
  );
}
