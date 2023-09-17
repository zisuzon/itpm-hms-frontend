
import React, { useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';


export const CreateTeamMemberForm = () => {
  const [birthday, setBirthday] = useState("");

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new team member</h5>
        <Form>
          <Row>
            {/* Name */}
            <Col md={6} className="mb-3">
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control required type="text" placeholder="Enter member's name" />
              </Form.Group>
            </Col>
            {/* Sort ID */}
            <Col md={6} className="mb-3">
              <Form.Group id="sortId">
                <Form.Label>Position</Form.Label>
                <Form.Control required type="number" placeholder="Position number of the member in list" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            {/* Image URL */}
            <Col md={6} className="mb-3">
              <Form.Group id="imageUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" placeholder="https://url-of-the-profile-image.com" />
              </Form.Group>
            </Col>
            {/* Designation */}
            <Col md={6} className="mb-3">
              <Form.Group id="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control type="text" placeholder="Member's designation" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Email */}
            <Col md={6} className="mb-3">
              <Form.Group id="emal">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" placeholder="name@company.com" />
              </Form.Group>
            </Col>
            {/* Phone */}
            <Col md={6} className="mb-3">
              <Form.Group id="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control required type="number" placeholder="+12-345 678 910" />
              </Form.Group>
            </Col>
          </Row>

          {/* Address */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="shortDescription">
                <Form.Label>Short Description</Form.Label>
                <Form.Control type="text" placeholder="Summary of the members bio" />
              </Form.Group>
            </Col>
          </Row>

          {/* Short Description */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="shortDescription">
                <Form.Label>Short Description</Form.Label>
                <Form.Control type="text" placeholder="Summary of the members bio" />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="description">
                <Form.Label>Description</Form.Label>
                <Form.Control required as="textarea" rows="3" placeholder="Details description of the members bio"/>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">Save All</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
