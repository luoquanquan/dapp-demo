import { Tabs } from 'antd';

import Evm from './chains/Evm';
import Tron from './chains/Tron';
import Solana from './chains/Solana';

const tabs = [
  Evm,
  Tron,
  Solana,
];

export default function App() {
  return (
    <div className="wrap">
      <Tabs defaultActiveKey="Evm" items={tabs} />
    </div>
  );
}
