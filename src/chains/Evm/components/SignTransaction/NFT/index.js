import { Col, Row } from 'antd';
import { Card, Space } from 'antd-mobile';
import ERC721 from './ERC721';
import ERC1155 from './ERC1155';

function NFT() {
  return (
    <Col xs={24} lg={12}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card direction="vertical" title="NFT">
          <Row gutter={12}>
            <Col xs={24} lg={12}>
              <ERC721 />
            </Col>
            <Col xs={24} lg={12}>
              <ERC1155 />
            </Col>
          </Row>
        </Card>
      </Space>
    </Col>

  );
}

export default NFT;
