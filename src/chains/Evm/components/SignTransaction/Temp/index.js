import {
  Button, Card, Space, message,
} from 'antd';
import { useContext } from 'react';
import EvmContext from '../../../context';

function Temp() {
  const { account } = useContext(EvmContext);

  const transferErc1155 = async () => {
    try {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x21038a4bd75f2a0f3cf8e5c6752c9f84cccb3f3e',
          value: '0x0',
          data: '0x2eb2c2d60000000000000000000000009d8ccdaf68a4705f33accce0b0ca5804c97eae570000000000000000000000001E0049783F008A0085193E00003D00cd54003c7100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  const approveErc1155 = async () => {
    try {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x21038a4bd75f2a0f3cf8e5c6752c9f84cccb3f3e',
          value: '0x0',
          data: '0xa22cb4650000000000000000000000001E0049783F008A0085193E00003D00cd54003c710000000000000000000000000000000000000000000000000000000000000001',
        }],
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  const revokeErc1155 = async () => {
    try {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x21038a4bd75f2a0f3cf8e5c6752c9f84cccb3f3e',
          value: '0x0',
          data: '0xa22cb4650000000000000000000000001E0049783F008A0085193E00003D00cd54003c710000000000000000000000000000000000000000000000000000000000000000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  const transferErc721 = async () => {
    try {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x533a413247b8afd857f15c58a5fd65c3cbe32cd6',
          value: '0x0',
          data: '0x23b872dd0000000000000000000000009d8ccdaf68a4705f33accce0b0ca5804c97eae570000000000000000000000001E0049783F008A0085193E00003D00cd54003c710000000000000000000000000000000000000000000000000000000000000001',
        }],
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  const approveErc721 = async () => {
    try {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x533a413247b8afd857f15c58a5fd65c3cbe32cd6',
          value: '0x0',
          data: '0xa22cb4650000000000000000000000001E0049783F008A0085193E00003D00cd54003c710000000000000000000000000000000000000000000000000000000000000001',
        }],
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  const revokeErc721 = async () => {
    try {
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: '0x533a413247b8afd857f15c58a5fd65c3cbe32cd6',
          value: '0x0',
          data: '0xa22cb4650000000000000000000000001E0049783F008A0085193E00003D00cd54003c710000000000000000000000000000000000000000000000000000000000000000',
        }],
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Card direction="vertical" title="临时测试">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button block onClick={transferErc1155}>转移 ERC1155</Button>
        <Button block onClick={approveErc1155}>授权 ERC1155</Button>
        <Button block onClick={revokeErc1155}>取消授权 ERC1155</Button>
        <Button block onClick={transferErc721}>转移 ERC721</Button>
        <Button block onClick={approveErc721}>授权 ERC721</Button>
        <Button block onClick={revokeErc721}>取消授权 ERC721</Button>
      </Space>
    </Card>
  );
}

export default Temp;
