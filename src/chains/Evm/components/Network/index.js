import { Card } from 'antd-mobile';
import { useContext } from 'react';
import EvmContext from '../../context';

export default function Network() {
  const { chainId } = useContext(EvmContext);

  return (
    <Card title="Network">
      <p>
        ChainId:
        {' '}
        {chainId}
      </p>

      <p>
        ChainIdHex:
        {' '}
        {`0x${chainId.toString(16)}`}
      </p>
    </Card>
  );
}
