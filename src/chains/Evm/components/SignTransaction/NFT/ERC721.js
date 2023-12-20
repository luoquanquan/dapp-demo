import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ethers } from 'ethers';
import {
  Alert,
  Button,
  Card, Col, Input, Row, Space, message,
} from 'antd';
import _ from 'lodash';
import { nftsAbi, nftsBytecode } from './const';
import EvmContext from '../../../context';

const usedNfts = [
  {

    chain: 'OKTC',
    chainId: '0x42',
    address: '0xA5D57594b75ebD63c7e66f256c93769498180584',
  },
  {
    chain: 'Polygon',
    chainId: '0x89',
    address: '0x533a413247B8Afd857f15C58a5Fd65c3cBe32cd6',
  },
];

function ERC721() {
  // chain context
  const { account, provider } = useContext(EvmContext);

  const [nftsContract, setNftsContract] = useState({});
  const [createNftLoading, setCreateNftLoading] = useState(false);

  const createNftRef = useRef();
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const nftAddress = urlParams.get('nftAddress');
      if (account && !nftsContract.address && nftAddress) {
        const targetNft = usedNfts.find(({ address }) => address === nftAddress);
        if (targetNft) {
          await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetNft.chainId }] });
        }
        const newNftsContract = new ethers.Contract(
          nftAddress,
          nftsAbi,
          provider.getSigner(),
        );
        setNftsContract(newNftsContract);
        createNftRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    })();
  }, [account]);
  const createNft = async () => {
    try {
      setCreateNftLoading(true);
      const nftsFactory = new ethers.ContractFactory(
        nftsAbi,
        nftsBytecode,
        provider.getSigner(),
      );

      const resp = await nftsFactory.deploy();
      await resp.deployTransaction.wait();
      setNftsContract(resp);
      message.success('创建成功');
    } catch (error) {
      message.error('创建失败');
    } finally {
      setCreateNftLoading(false);
    }
  };

  const [mintLoading, setMintLoading] = useState(false);
  const [mintCount, setMintCount] = useState(3);
  const mint = async () => {
    try {
      setMintLoading(true);
      const result = await nftsContract.mintNFTs('1', {
        from: account,
      });
      await result.wait();
      message.success('mint 成功');
    } catch (error) {
      message.error('mint 失败');
    } finally {
      setMintLoading(false);
    }
  };

  const [approveLoading, setApproveLoading] = useState(false);
  const myAddress = '0x1E0049783F008A0085193E00003D00cd54003c71';
  const approve = async () => {
    try {
      setApproveLoading(true);
      const result = await nftsContract.setApprovalForAll(
        myAddress,
        true,
        {
          from: account,
        },
      );
      await result.wait();
      message.success('授权成功');
    } catch (error) {
      message.error('授权失败');
    } finally {
      setApproveLoading(false);
    }
  };

  const [revokeLoading, setRevokeLoading] = useState(false);
  const revoke = async () => {
    try {
      setRevokeLoading(true);
      await nftsContract.setApprovalForAll(
        myAddress,
        false,
        {
          from: account,
        },
      );
      message.success('取消授权成功');
    } catch (error) {
      message.error('取消授权失败');
    } finally {
      setRevokeLoading(false);
    }
  };

  const [transferFromLoading, setTransferFromLoading] = useState(false);
  const transferFrom = async () => {
    try {
      setTransferFromLoading(true);
      const result = await nftsContract.transferFrom(
        account,
        myAddress,
        '1',
        {
          from: account,
        },
      );
      await result.wait();
      message.success('转移成功');
    } catch (error) {
      message.error('转移失败');
    } finally {
      setTransferFromLoading(false);
    }
  };

  const ready = nftsContract.address && account;

  return (
    <Card ref={createNftRef} direction="vertical" title="ERC721">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          type="info"
          message="合集地址"
          description={nftsContract.address}
        />
        <Button
          block
          loading={createNftLoading}
          onClick={createNft}
          disabled={nftsContract.address || !account}
        >
          Deploy
        </Button>
        <Input
          value={mintCount}
          disabled={!ready}
          onChange={({ target: { value } }) => {
            setMintCount(value);
          }}
        />
        <Button
          block
          loading={mintLoading}
          onClick={mint}
          disabled={!ready}
        >
          Mint
        </Button>
        <Button
          block
          loading={approveLoading}
          onClick={approve}
          disabled={!ready}
        >
          授权合集
        </Button>
        <Button
          block
          onClick={revoke}
          loading={revokeLoading}
          disabled={!ready}
        >
          取消授权
        </Button>
        <Button
          block
          onClick={transferFrom}
          loading={transferFromLoading}
          disabled={!ready}
        >
          转移 NFT
        </Button>
        <Alert
          type="info"
          message="测试 NFT"
          description={(
            <Row gutter={12}>
              {usedNfts.map((nft) => (
                <Col>
                  <a href={`/?nftAddress=${nft.address}`}>
                    {nft.chain}
                  </a>
                </Col>
              ))}
            </Row>
          )}
        />
      </Space>
    </Card>
  );
}

export default ERC721;
