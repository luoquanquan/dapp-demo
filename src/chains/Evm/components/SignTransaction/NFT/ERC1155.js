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
import { grayAddress, myAddress, openSeaAddress } from '../../const';

const usedNfts = [
  {
    chain: 'Polygon',
    chainId: '0x89',
    address: '0x2bf22a1143f406C2DEb7ECEBfEd26755d1124683',
  },
];

function ERC1155() {
  const { account, provider } = useContext(EvmContext);
  const [nftsContract, setNftsContract] = useState({});

  const createNftRef = useRef();
  const [createNftLoading, setCreateNftLoading] = useState(false);
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
  const batchTRansfer = (to = myAddress) => async () => {
    try {
      setBatchTRansferLoading(true);
      await nftsContract.safeBatchTransferFrom(
        account,
        to,
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
  const approve = (isApprove = true, spender = openSeaAddress) => async () => {
    try {
      setApproveLoading(true);
      const result = await nftsContract.setApprovalForAll(
        spender,
        isApprove,
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

  return (
    <Card
      ref={createNftRef}
      direction="vertical"
      title="ERC1155"
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
          onClick={batchTRansfer()}
          disabled={!nftsContract.address}
        >
          Transfer
        </Button>
        <Button
          block
          loading={batchTRansferLoading}
          onClick={batchTRansfer(grayAddress)}
          disabled={!nftsContract.address}
        >
          Transfer GrayAddress
        </Button>
        <Button
          block
          loading={approveLoading}
          onClick={approve()}
          disabled={!nftsContract.address}
        >
          setApprovalForAll
        </Button>
        <Button
          block
          loading={approveLoading}
          onClick={approve(true, grayAddress)}
          disabled={!nftsContract.address}
        >
          setApprovalForAll 灰地址
        </Button>
        <Button
          block
          loading={approveLoading}
          onClick={approve(false)}
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
                <Col key={nft.address}>
                  <a href={`/?erc1155Address=${nft.address}`}>
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
