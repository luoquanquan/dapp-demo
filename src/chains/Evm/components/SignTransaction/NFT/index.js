import { Card, Col, Row } from 'antd';
import ERC721 from './ERC721';
import ERC1155 from './ERC1155';

function NFT() {
  return (
    <Card direction="vertical" title="NFT">
      <Row gutter={12}>
        <Col span={12}>
          <ERC721 />
        </Col>
        <Col span={12}>
          <ERC1155 />
        </Col>
      </Row>
    </Card>
  );
}

export default NFT;
