import { Card } from 'antd-mobile';
import { useContext } from 'react';
import EvmContext from '../../context';

export default function Network() {
  const { chainId } = useContext(EvmContext);

  return (
    <Card title="Network">
      ChainId:
      {chainId}
    </Card>
  );
}
