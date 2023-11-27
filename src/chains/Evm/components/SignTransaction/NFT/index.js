import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ethers } from 'ethers';
import {
  Alert,
  Button,
  Card, Space, message,
} from 'antd';
import { nftsAbi, nftsBytecode } from './const';
import EvmContext from '../../../context';

function NFT() {
  // chain context
  const { account, provider } = useContext(EvmContext);

  const [nftsContract, setNftsContract] = useState({});
  const [createNftLoading, setCreateNftLoading] = useState(false);

  const createNftRef = useRef();
  useEffect(() => {
    ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x42' }] });
    const urlParams = new URLSearchParams(window.location.search);
    const nftAddress = urlParams.get('nftAddress');
    if (account && !nftsContract.address && nftAddress) {
      const newNftsContract = new ethers.Contract(
        nftAddress,
        nftsAbi,
        provider.getSigner(),
      );
      setNftsContract(newNftsContract);
      createNftRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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
  const [canApprove, setCanApprove] = useState(false);
  const [canTransferFrom, setCanTransferFrom] = useState(false);
  const mint = async () => {
    try {
      setMintLoading(true);
      const result = await nftsContract.mintNFTs('1', {
        from: account,
      });
      await result.wait();
      setCanApprove(true);
      setCanTransferFrom(true);
      message.success('mint 成功');
    } catch (error) {
      message.error('mint 失败');
    } finally {
      setMintLoading(false);
    }
  };

  const [approveLoading, setApproveLoading] = useState(false);
  const [canRevoke, setCanRevoke] = useState(false);
  const myAddress = '0xb2d9def7ed8ba2d02d1e9d1d0d1920986e3a1446';
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
      setCanRevoke(true);
      setCanApprove(false);
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
      setCanRevoke(false);
      setCanApprove(true);
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

  //

  return (
    <Card ref={createNftRef} direction="vertical" title="NFT" extra={nftsContract.address || <a href="/?nftAddress=0x4c630970f03A7F5A286Af3821BE0b45F1E343bf7">使用已有合集</a>}>
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
          创建合集
        </Button>
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
          loading={approveLoading}
          onClick={approve}
          disabled={!canApprove || !account}
        >
          授权合集
        </Button>
        <Button
          block
          onClick={revoke}
          loading={revokeLoading}
          disabled={!canRevoke || !account}
        >
          取消授权
        </Button>
        <Button
          block
          onClick={transferFrom}
          loading={transferFromLoading}
          disabled={!canTransferFrom || !account}
        >
          转移 NFT
        </Button>
      </Space>
    </Card>
  );
}

export default NFT;
