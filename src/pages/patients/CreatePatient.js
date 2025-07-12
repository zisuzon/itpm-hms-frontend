import React from "react";
import { Col, Row } from "@themesberg/react-bootstrap";
import { CreatePatientForm } from "./CreatePatientForm";

export default () => {
  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreatePatientForm />
        </Col>
      </Row>
    </>
  );
};
