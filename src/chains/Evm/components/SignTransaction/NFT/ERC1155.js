import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ethers } from 'ethers';
import {
  Alert,
  Col, Input, Row, Typography, message,
} from 'antd';
import {
  Button,
  Card, Space,
} from 'antd-mobile';
import {
  erc1155Abi, erc1155Bytecode,
} from './const';
import EvmContext from '../../../context';
import {
  getEvmBlackContractAddress, getStrongBlackEoaAddress, myAddress, openSeaAddress,
} from '../../../../../utils/const';

const usedNfts = [
  {
    chain: 'Polygon',
    chainId: '0x89',
    address: '0x2bf22a1143f406C2DEb7ECEBfEd26755d1124683',
  },
];

function ERC1155() {
  const { account, provider, chainId } = useContext(EvmContext);
  const grayAddress = getEvmBlackContractAddress(chainId);
  const strongBlackAddress = getStrongBlackEoaAddress(chainId);

  const [nftsContract, setNftsContract] = useState({});

  const createNftRef = useRef();
  const [createNftLoading, setCreateNftLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const erc1155Address = urlParams.get('erc1155Address');
      if (account && erc1155Address) {
        createNftRef.current?.scrollIntoView({ behavior: 'smooth' });
        const targetNft = usedNfts.find(({ address }) => address === erc1155Address);
        if (targetNft) {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetNft.chainId }] });
        }
        const newNftsContract = new ethers.Contract(
          erc1155Address,
          erc1155Abi,
          new ethers.providers.Web3Provider(provider, 'any').getSigner(),
        );
        setNftsContract(newNftsContract);
      }
    })();
  }, [account, provider]);
  const createNft = async () => {
    try {
      setCreateNftLoading(true);
      const nftsFactory = new ethers.ContractFactory(
        erc1155Abi,
        erc1155Bytecode,
        new ethers.providers.Web3Provider(provider, 'any').getSigner(),
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
  const setApprovalForAll = (isApprove = true, spender = openSeaAddress) => async () => {
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
    <div ref={createNftRef}>
      <Card
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
          {
            !!grayAddress && (
              <Button
                block
                color="danger"
                loading={batchTRansferLoading}
                onClick={batchTRansfer(grayAddress)}
                disabled={!nftsContract.address}
              >
                Transfer Black Address
              </Button>
            )
          }
          {
            !!strongBlackAddress && (
              <Button
                block
                color="danger"
                loading={batchTRansferLoading}
                onClick={batchTRansfer(strongBlackAddress)}
                disabled={!nftsContract.address}
              >
                Transfer Strong Black Address
              </Button>
            )
          }
          <Button
            block
            loading={approveLoading}
            onClick={setApprovalForAll()}
            disabled={!nftsContract.address}
          >
            setApprovalForAll
          </Button>
          {
            !!grayAddress && (
              <Button
                block
                color="danger"
                loading={approveLoading}
                onClick={setApprovalForAll(true, grayAddress)}
                disabled={!nftsContract.address}
              >
                setApprovalForAll Black Address
              </Button>
            )
          }
          {
            !!strongBlackAddress && (
              <Button
                block
                color="danger"
                loading={approveLoading}
                onClick={setApprovalForAll(true, strongBlackAddress)}
                disabled={!nftsContract.address}
              >
                setApprovalForAll Strong Black Address
              </Button>
            )
          }
          <Button
            block
            loading={approveLoading}
            onClick={setApprovalForAll(true, myAddress)}
            disabled={!nftsContract.address}
          >
            setApprovalForAll to EOA
          </Button>
          <Button
            block
            loading={approveLoading}
            onClick={setApprovalForAll(false)}
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
                    <a href={`${process.env.PUBLIC_URL}/?erc1155Address=${nft.address}`}>
                      {nft.chain}
                    </a>
                  </Col>
                ))}
              </Row>
            )}
          />
        </Space>
      </Card>
    </div>
  );
}

export default ERC1155;
