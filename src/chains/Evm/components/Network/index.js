import { Card } from 'antd-mobile';
import { useContext } from 'react';
import EvmContext from '../../context';

export default function Network() {
  const { chainId } = useContext(EvmContext);
  console.log('chainId: ', chainId);

  return (
    <Card title="Network">
      ChainId:
      {chainId}
    </Card>
  );
}
