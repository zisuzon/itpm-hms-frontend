import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "@themesberg/react-bootstrap";
import { CreateDoctorTeamForm } from "./CreateDoctorTeamForm";

export default () => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!id) {
      history.push("/doctor-teams/all-doctor-teams");
    }
  }, [history, id]);

  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreateDoctorTeamForm />
        </Col>
      </Row>
    </>
  );
};
