import React from "react";
import { Col, Row } from "@themesberg/react-bootstrap";
import { CreateWardForm } from "./CreateWardForm";

export default () => {
  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreateWardForm />
        </Col>
      </Row>
    </>
  );
};
