import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { CreateTeamMemberForm } from "./CreateTeamMemberForm";

export default () => {
  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreateTeamMemberForm />
        </Col>
      </Row>
    </>
  );
};
