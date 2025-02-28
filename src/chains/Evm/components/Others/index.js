import {
  Col, Row,
} from 'antd';
import {
  Card,
} from 'antd-mobile';
import Tools from './components/Tools';
import RareCases from './components/RareCases';
import TestForDefaultGas from './components/TestForDefaultGas';
import RouteContract from './components/RouteContract';
import DemoTx from './components/DemoTx';

function Others() {
  return (
    <Card title="Others">
      <Row gutter={12}>
        <Col xs={24} lg={8}>
          <Tools />
        </Col>
        <Col xs={24} lg={8}>
          <RareCases />
        </Col>
        <Col xs={24} lg={8}>
          <DemoTx />
        </Col>
      </Row>
      <Row gutter={12}>
        <Col xs={24} lg={12}>
          <TestForDefaultGas />
        </Col>
        <Col xs={24} lg={12}>
          <RouteContract />
        </Col>
      </Row>
    </Card>
  );
}

export default Others;
