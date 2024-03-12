import React, { useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row } from '@themesberg/react-bootstrap';
import { CreatePartnerForm } from "./CreatePartnerForm";

export default () => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if(!id) {
      history.push('/team-members/all-team-members')
    }
  }, [id, history]);

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
