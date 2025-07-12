import React from "react";
import { Col, Row } from "@themesberg/react-bootstrap";
import { CreateDoctorForm } from "./CreateDoctorForm";

export default () => {
  return (
    <>
      <Row>
        <Col xs={12} xl={12}>
          <CreateDoctorForm />
        </Col>

        {/* <Col xs={12} xl={4}>
          <Row>
            <Col xs={12}>
              <ProfileCardWidget />
            </Col>
            <Col xs={12}>
              <ChoosePhotoWidget
                title="Select profile photo"
                photo={Profile3}
              />
            </Col>
          </Row>
        </Col> */}
      </Row>
    </>
  );
};
