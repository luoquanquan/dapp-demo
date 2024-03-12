import {
  Button, Card, Space, message,
} from 'antd';
import * as nearApi from 'near-api-js';
import { Contract } from 'near-api-js';
import { useState } from 'react';
import { config, wNearContractId } from '../../const';

function DappSelf({ access }) {
  const [ftMetaDataLoading, setFtMetaDataLoading] = useState(false);
  const ftMetaData = async () => {
    try {
      setFtMetaDataLoading(true);
      const accountId = window.near.getAccountId();
      const keyStore = new nearApi.keyStores.InMemoryKeyStore();
      const keyPair = nearApi.KeyPair.fromString(access.secretKey);
      await keyStore.setKey(config.network, accountId, keyPair);
      const near = await nearApi.connect(
        { deps: { keyStore }, ...config },
      );
      const account = await near.account(accountId);

      const contract = new Contract(account, wNearContractId, {
        viewMethods: ['ft_metadata'],
        changeMethods: [],
      });

      const resp = await contract.ft_metadata();
      console.log('Current log: resp: ', resp);
    } catch (error) {
      message.error(error.message);
    } finally {
      setFtMetaDataLoading(false);
    }
  };

  const [ftBalanceOfLoading, setFtBalanceOfLoading] = useState(false);
  const ftBalanceOf = async () => {
    try {
      setFtBalanceOfLoading(true);
      const accountId = window.near.getAccountId();
      const keyStore = new nearApi.keyStores.InMemoryKeyStore();
      const keyPair = nearApi.KeyPair.fromString(access.secretKey);
      await keyStore.setKey(config.network, accountId, keyPair);
      const near = await nearApi.connect(
        { deps: { keyStore }, ...config },
      );
      const account = await near.account(accountId);

      const contract = new Contract(account, wNearContractId, {
        viewMethods: ['ft_balance_of'],
        changeMethods: [],
      });

      const resp = await contract.ft_balance_of({
        account_id: window.near.getAccountId(),
      });
      console.log('Current log: resp: ', resp);
    } catch (error) {
      message.error(error.message);
    } finally {
      setFtBalanceOfLoading(false);
    }
  };

  const [ftTransferLoading, setFtTransferLoading] = useState(false);
  const ftTransfer = async () => {
    try {
      setFtTransferLoading(true);
      const accountId = window.near.getAccountId();
      const keyStore = new nearApi.keyStores.InMemoryKeyStore();
      const keyPair = nearApi.KeyPair.fromString(access.secretKey);
      await keyStore.setKey(config.network, accountId, keyPair);
      const near = await nearApi.connect(
        { deps: { keyStore }, ...config },
      );
      const account = await near.account(accountId);

      const contract = new Contract(account, wNearContractId, {
        viewMethods: [],
        changeMethods: ['ft_transfer'],
      });

      const resp = await contract.ft_transfer({
        amount: '10000',
        receiver_id: 'c1f0f7bc0deed7d2151e7987ad2aca74b8e856c1f87efa93fec1ff4075b4d6e4',
      }, '300000000000000', '1');
      console.log('Current log: resp: ', resp);
    } catch (error) {
      message.error(error.message);
      console.log('Current log: error: ', error);
    } finally {
      setFtTransferLoading(false);
    }
  };

  if (!access) {
    return null;
  }

  return (
    <Card direction="vertical" title="dapp 内部交互 - 无需唤起插件">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          loading={ftMetaDataLoading}
          onClick={ftMetaData}
        >
          ftMetaData
        </Button>

        <Button
          block
          loading={ftBalanceOfLoading}
          onClick={ftBalanceOf}
        >
          ftBalanceOf
        </Button>

        <Button
          block
          loading={ftTransferLoading}
          onClick={ftTransfer}
        >
          ftTransfer
        </Button>
      </Space>
    </Card>
  );
}

export default DappSelf;
