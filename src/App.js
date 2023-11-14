import { Tabs } from 'antd';

import Evm from './chains/Evm';
import Tron from './chains/Tron';

const tabs = [
  Evm,
  Tron,
];

export default function App() {
  return (
    <div className="wrap">
      <Tabs defaultActiveKey="Evm" items={tabs} />
    </div>
  );
}
