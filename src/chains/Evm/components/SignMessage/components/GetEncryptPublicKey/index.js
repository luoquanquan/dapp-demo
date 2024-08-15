import { Alert, Col } from 'antd';
import {
  Button, Card, Input, Space,
} from 'antd-mobile';
import { encrypt } from 'eth-sig-util';
import { useContext, useState } from 'react';
import { ethers } from 'ethers';
import EvmContext from '../../../../context';
import { toastFail } from '../../../../../../utils/toast';

function GetEncryptPublicKey() {
  const { account } = useContext(EvmContext);

  const [getEncryptPublicKeyLoading, setGetEncryptPublicKeyLoading] = useState(false);
  const [encryptPublicKey, setEncryptPublicKey] = useState('');
  const handleGetEncryptPublicKey = async () => {
    try {
      setGetEncryptPublicKeyLoading(true);
      const resp = await ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [account],
      });
      setEncryptPublicKey(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setGetEncryptPublicKeyLoading(false);
    }
  };

  const [oriText, setOriText] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const handleEncryptMessage = async () => {
    try {
      const encryptedStr = encrypt(
        encryptPublicKey,
        { data: oriText },
        'x25519-xsalsa20-poly1305',
      );
      const ret = ethers.utils.hexlify(Buffer.from(JSON.stringify(encryptedStr)));
      setCiphertext(ret);
    } catch (error) {
      console.log(error);
      toastFail();
    }
  };

  const [decryptLoading, setDecryptLoading] = useState(false);
  const [decryptedStr, setDecryptedStr] = useState('');
  const handleDecrypt = async () => {
    try {
      setDecryptLoading(true);
      const resp = await ethereum.request({
        method: 'eth_decrypt',
        params: [ciphertext, account],
      });
      setDecryptedStr(resp);
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setDecryptLoading(false);
    }
  };

  return (
    <Col span={24}>
      <Card direction="vertical" title="获取加密公钥">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            disabled={!account}
            loading={getEncryptPublicKeyLoading}
            onClick={handleGetEncryptPublicKey}
          >
            获取公钥
          </Button>
          <Alert
            type="info"
            message="公钥"
            description={encryptPublicKey}
          />
          <Input disabled={!encryptPublicKey} value={oriText} placeholder="请输入明文" onChange={setOriText} />
          <Button
            block
            disabled={!oriText}
            onClick={handleEncryptMessage}
          >
            加密
          </Button>
          <Alert
            type="info"
            message="密文"
            description={ciphertext}
          />
          <Button
            block
            loading={decryptLoading}
            disabled={!ciphertext}
            onClick={handleDecrypt}
          >
            解密
          </Button>
          <Alert
            type="info"
            message="解密后文本(需和原文本一致)"
            description={decryptedStr}
          />
        </Space>
      </Card>
    </Col>
  );
}

export default GetEncryptPublicKey;
