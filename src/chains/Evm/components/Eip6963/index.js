import { Col, Row } from 'antd';
import { Card } from 'antd-mobile';
import { ethers } from 'ethers';
import { find, last, uniqBy } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import EvmContext from '../../context';

function Provider({ provider, onSelected, active }) {
  const { info } = provider;
  return (
    <Col xs={24} lg={8}>
      <Card
        style={{ cursor: 'pointer' }}
        onClick={onSelected}
        title={<img src={info.icon} width={24} height={24} alt="" />}
        extra={active ? <span style={{ fontSize: '20px' }}>🟢</span> : null}
      >
        {/* eslint-disable react/jsx-one-expression-per-line */}
        <p>name: {info.name}</p>
        <p>rdns: {info.rdns}</p>
        <p>uuid: {info.uuid}</p>
      </Card>
    </Col>
  );
}

function Eip6963() {
  const [providers, setProviders] = useState([]);
  const { provider, setProvider } = useContext(EvmContext);

  useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum, 'any'));

    window.addEventListener('eip6963:announceProvider', (event) => {
      setProviders((p) => uniqBy([...p, event.detail], 'info.uuid'));
    });
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  }, []);

  useEffect(() => {
    if (providers?.length) {
      const strongWallet = find(providers, (p) => p?.info?.name?.endsWith('Wallet'));
      console.log("strongWallet: ", strongWallet);
      setProvider(strongWallet?.provider || last(providers).provider);
    }
  }, [providers]);

  return (
    <Card title="EIP 6963">
      <Row gutter={16}>
        {providers.map((item) => (
          <Provider
            active={provider === item.provider}
            key={item.info.uuid}
            provider={item}
            onSelected={() => {
              setProvider(item.provider);
            }}
          />
        ))}
      </Row>
    </Card>
  );
}

export default Eip6963;
