import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ethers } from 'ethers';
import {
  Alert,
  Col, Row, message,
} from 'antd';
import {
  Button, Card, Input, Space,
} from 'antd-mobile';
import { nftsAbi, nftsBytecode } from './const';
import EvmContext from '../../../context';

import {
  getStrongBlackEoaAddress, myEvmAddress, openSeaAddress, getEvmBlackContractAddress,
} from '../../../const';

const usedNfts = [
  {
    chain: 'Polygon',
    chainId: '0x89',
    address: '0xbfc5224DF96f01ad37D874E5a477aAFb92a5E970',
  },
];

function ERC721() {
  const { account, provider, chainId } = useContext(EvmContext);

  const grayAddress = getEvmBlackContractAddress(chainId);
  const strongBlackAddress = getStrongBlackEoaAddress(chainId);

  const [nftsContract, setNftsContract] = useState({});
  const [createNftLoading, setCreateNftLoading] = useState(false);

  const createNftRef = useRef();
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const nftAddress = urlParams.get('nftAddress');
      if (account && nftAddress) {
        createNftRef.current?.scrollIntoView({ behavior: 'smooth' });

        const targetNft = usedNfts.find(({ address }) => address === nftAddress);
        if (targetNft) {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetNft.chainId }] });
        }
        const newNftsContract = new ethers.Contract(
          nftAddress,
          nftsAbi,
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
        nftsAbi,
        nftsBytecode,
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
  const [mintCount, setMintCount] = useState('1');
  const mint = async () => {
    try {
      setMintLoading(true);
      const result = await nftsContract.mintNFTs(mintCount || '1', {
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
  const [approveNftId, setApproveNftId] = useState('3');
  const approve = (spender = openSeaAddress) => async () => {
    try {
      setApproveLoading(true);
      const result = await nftsContract.approve(
        spender,
        approveNftId,
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

  const [setApprovalForAllLoading, setSetApprovalForAllLoading] = useState(false);
  const setApprovalForAll = ({ spender = openSeaAddress, isApprove = true } = {}) => async () => {
    try {
      setSetApprovalForAllLoading(true);
      const result = await nftsContract.setApprovalForAll(
        spender,
        isApprove,
      );
      await result.wait();
      message.success('授权成功');
    } catch (error) {
      message.error('授权失败');
    } finally {
      setSetApprovalForAllLoading(false);
    }
  };

  const [transferFromCount, setTransferFromCount] = useState('3');
  const [transferFromLoading, setTransferFromLoading] = useState(false);
  const transferFrom = async () => {
    try {
      setTransferFromLoading(true);
      const result = await nftsContract.transferFrom(
        account,
        openSeaAddress,
        transferFromCount || '1',
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

  const [
    transferFromWithGrayAddressLoading,
    setTransferFromWithGrayAddressLoading,
  ] = useState(false);
  const transferFromWithGrayAddress = (target = grayAddress) => async () => {
    try {
      setTransferFromWithGrayAddressLoading(true);
      const result = await nftsContract.transferFrom(
        account,
        target,
        transferFromCount || '1',
        {
          from: account,
        },
      );
      await result.wait();
      message.success('转移成功');
    } catch (error) {
      message.error('转移失败');
    } finally {
      setTransferFromWithGrayAddressLoading(false);
    }
  };

  const ready = nftsContract.address && account;

  return (
    <div ref={createNftRef}>
      <Card direction="vertical" title="ERC721">
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
            placeholder="请输入 mint 数量"
            onChange={setMintCount}
          />
          <Button
            block
            loading={mintLoading}
            onClick={mint}
            disabled={!ready || !mintCount}
          >
            Mint
          </Button>
          <Input
            placeholder="请输入授权 nft id"
            value={approveNftId}
            onChange={setApproveNftId}
          />
          <Button
            block
            loading={approveLoading}
            onClick={approve()}
            disabled={!ready || !approveNftId}
          >
            approve
          </Button>
          {
            !!grayAddress && (
              <Button
                block
                color="danger"
                loading={approveLoading}
                onClick={approve(grayAddress)}
                disabled={!ready || !approveNftId}
              >
                approve Black Address
              </Button>
            )
          }
          {
            !!strongBlackAddress && (
              <Button
                block
                color="danger"
                loading={approveLoading}
                onClick={approve(strongBlackAddress)}
                disabled={!ready || !approveNftId}
              >
                approve Strong Black Address
              </Button>
            )
          }
          <Button
            block
            color="warning"
            loading={approveLoading}
            onClick={approve(myEvmAddress)}
            disabled={!ready || !approveNftId}
          >
            approve to EOA
          </Button>
          <Button
            block
            loading={setApprovalForAllLoading}
            onClick={setApprovalForAll()}
            disabled={!ready}
          >
            setApprovalForAll
          </Button>
          {
            !!grayAddress && (
              <Button
                block
                color="danger"
                loading={setApprovalForAllLoading}
                onClick={setApprovalForAll({ spender: grayAddress })}
                disabled={!ready}
              >
                setApprovalForAll Black Address
              </Button>
            )
          }
          {
            !!grayAddress && (
              <Button
                block
                color="danger"
                loading={setApprovalForAllLoading}
                onClick={setApprovalForAll({ spender: strongBlackAddress })}
                disabled={!ready}
              >
                setApprovalForAll Strong Black Address
              </Button>
            )
          }
          <Button
            block
            color="warning"
            loading={setApprovalForAllLoading}
            onClick={setApprovalForAll({ spender: myEvmAddress })}
            disabled={!ready}
          >
            setApprovalForAll to EOA
          </Button>
          <Button
            block
            onClick={setApprovalForAll({ isApprove: false })}
            loading={setApprovalForAllLoading}
            disabled={!ready}
          >
            revoke
          </Button>
          <Input
            value={transferFromCount}
            placeholder="请设置转移数量"
            onChange={({ target: { value } }) => {
              setTransferFromCount(value);
            }}
          />
          <Button
            block
            onClick={transferFrom}
            loading={transferFromLoading}
            disabled={!ready}
          >
            转移 NFT
          </Button>
          {
            !!grayAddress && (
              <Button
                block
                color="danger"
                onClick={transferFromWithGrayAddress()}
                loading={transferFromWithGrayAddressLoading}
                disabled={!ready}
              >
                Transfer NFT to Black Address
              </Button>
            )
          }
          {
            !!strongBlackAddress && (
              <Button
                block
                color="danger"
                onClick={transferFromWithGrayAddress(strongBlackAddress)}
                loading={transferFromWithGrayAddressLoading}
                disabled={!ready}
              >
                Transfer NFT to Strong Black Address
              </Button>
            )
          }

          <Alert
            type="info"
            message="测试 NFT"
            description={(
              <Row gutter={12}>
                {usedNfts.map((nft) => (
                  <Col key={nft.address}>
                    <a href={`${process.env.PUBLIC_URL}/?nftAddress=${nft.address}`}>
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

export default ERC721;
