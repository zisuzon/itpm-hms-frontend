import React, { useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row } from '@themesberg/react-bootstrap';
import { CreateSectoralResearchForm } from "./CreateSectoralResearchForm";

export default () => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if(!id) {
      history.push('/capability/all-sectoral-research')
    }
  }, [history, id]);

  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreateSectoralResearchForm />
        </Col>
      </Row>
    </>
  );
};
