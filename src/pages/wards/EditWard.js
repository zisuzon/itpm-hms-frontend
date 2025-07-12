import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "@themesberg/react-bootstrap";
import { CreateWardForm } from "./CreateWardForm";

export default () => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!id) {
      history.push("/wards/all-wards");
    }
  }, [id, history]);

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
