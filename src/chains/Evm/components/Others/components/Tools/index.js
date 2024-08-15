import {
  Button,
  Card,
  Space,
} from 'antd-mobile';
import { useContext } from 'react';
import EvmContext from '../../../../context';

function LinkButton({ href, disabled = false, children }) {
  const onClick = () => {
    window.open(href);
  };

  return (
    <Button block onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

function Tools() {
  const { account, chainId } = useContext(EvmContext);

  return (
    <Card title="Tools">
      <Space direction="vertical" style={{ width: '100%' }}>
        <LinkButton href={`https://app.scamsniffer.io/permits/${account || ''}`}>
          Scam Sniffer
        </LinkButton>
        <LinkButton href={`https://revoke.cash/zh/address/${account || ''}?chainId=${chainId}`}>
          revoke.cash
        </LinkButton>
        <LinkButton href="https://faucets.pk910.de/">
          PoWFaucet
        </LinkButton>
      </Space>
    </Card>
  );
}

export default Tools;
