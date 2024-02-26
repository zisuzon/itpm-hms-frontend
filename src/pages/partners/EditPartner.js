import React, { useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCartArrowDown, faChartPie, faChevronDown, faClipboard, faCommentDots, faFileAlt, faPlus, faRocket, faStore } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown } from '@themesberg/react-bootstrap';
import { CreatePartnerForm } from "./CreatePartnerForm";

export default () => {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if(!id) {
      history.push('/team-members/all-team-members')
    }
  }, []);

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
