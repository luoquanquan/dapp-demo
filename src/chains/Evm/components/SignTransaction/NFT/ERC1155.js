import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ethers } from 'ethers';
import {
  Alert,
  Button,
  Card, Col, Input, Row, Space, Typography, message,
} from 'antd';
import {
  erc1155Abi, erc1155Bytecode,
} from './const';
import EvmContext from '../../../context';

const usedNfts = [
  {
    chain: 'Polygon',
    chainId: '0x89',
    address: '0x21038A4bd75F2a0F3cf8E5C6752c9F84cCcB3f3E',
  },
];

function ERC1155() {
  // chain context
  const { account, provider } = useContext(EvmContext);

  const [nftsContract, setNftsContract] = useState({});
  const [createNftLoading, setCreateNftLoading] = useState(false);

  const createNftRef = useRef();
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const erc1155Address = urlParams.get('erc1155Address');
      if (account && !nftsContract.address && erc1155Address) {
        const targetNft = usedNfts.find(({ address }) => address === erc1155Address);
        if (targetNft) {
          await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetNft.chainId }] });
        }
        const newNftsContract = new ethers.Contract(
          erc1155Address,
          erc1155Abi,
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
        erc1155Abi,
        erc1155Bytecode,
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
  const [tokenIds, setTokenIds] = useState('1, 2, 3');
  const [tokenAmounts, setTokenAmounts] = useState('1, 5, 7');
  const mint = async () => {
    try {
      setMintLoading(true);
      const params = [
        account,
        tokenIds.split(',').map(Number),
        tokenAmounts.split(',').map(Number),
        '0x',
      ];
      await nftsContract.mintBatch(...params);
      message.success('mint 成功');
    } catch (error) {
      message.error('mint 失败');
    } finally {
      setMintLoading(false);
    }
  };

  const [batchTRansferLoading, setBatchTRansferLoading] = useState(false);
  const batchTRansfer = async () => {
    try {
      setBatchTRansferLoading(true);
      await nftsContract.safeBatchTransferFrom(
        account,
        '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
        tokenIds.split(',').map(Number),
        tokenAmounts.split(',').map(Number),
        '0x',
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setBatchTRansferLoading(false);
    }
  };

  const [approveLoading, setApproveLoading] = useState(false);
  const approve = async () => {
    try {
      setApproveLoading(true);

      const result = await nftsContract.setApprovalForAll(
        '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
        true,
        {
          from: account,
        },
      );
      await result.wait();
    } catch (error) {
      message.error(error.message);
    } finally {
      setApproveLoading(false);
    }
  };

  const [revokeLoading, setRevokeLoading] = useState(false);
  const revoke = async () => {
    try {
      setRevokeLoading(true);

      const result = await nftsContract.setApprovalForAll(
        '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446',
        false,
        {
          from: account,
        },
      );
      await result.wait();
    } catch (error) {
      message.error(error.message);
    } finally {
      setRevokeLoading(false);
    }
  };

  return (
    <Card
      ref={createNftRef}
      direction="vertical"
      title="ERC1155"
      extra={nftsContract.address}
    >
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

        <div>
          <Typography.Title level={5}>Token IDs</Typography.Title>
          <Input
            value={tokenIds}
            onChange={(e) => setTokenIds(e.target.value)}
          />
        </div>
        <div>
          <Typography.Title level={5}>Token Amounts</Typography.Title>
          <Input
            value={tokenAmounts}
            onChange={(e) => setTokenAmounts(e.target.value)}
          />
        </div>
        <Button
          block
          loading={mintLoading}
          onClick={mint}
          disabled={!nftsContract.address || !account}
        >
          Mint
        </Button>

        <Button
          block
          loading={batchTRansferLoading}
          onClick={batchTRansfer}
          disabled={!nftsContract.address}
        >
          Batch Transfer
        </Button>

        <Button
          block
          loading={approveLoading}
          onClick={approve}
          disabled={!nftsContract.address}
        >
          Approve For All
        </Button>

        <Button
          block
          loading={revokeLoading}
          onClick={revoke}
          disabled={!nftsContract.address}
        >
          revoke
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

export default ERC1155;
