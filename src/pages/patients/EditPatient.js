import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "@themesberg/react-bootstrap";
import { CreatePatientForm } from "./CreatePatientForm";

export default () => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!id) {
      history.push("/patients/all-patients");
    }
  }, [id, history]);

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
