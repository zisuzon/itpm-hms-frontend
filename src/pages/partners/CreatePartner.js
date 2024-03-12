import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { CreatePartnerForm } from "./CreatePartnerForm";

export default () => {
  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreatePartnerForm />
        </Col>
      </Row>
    </>
  );
};
