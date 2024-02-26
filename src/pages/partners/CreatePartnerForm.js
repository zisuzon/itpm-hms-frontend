
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row, Card, Form, Button, Alert } from '@themesberg/react-bootstrap';
import axiosInstance from '../../axios'

export const CreatePartnerForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sortId: '',
    partnerType: '',
  });

  function getPartnerById(memberId) {
    axiosInstance
    .get(`api/partners/${memberId}`)
    .then((response) => {
      console.log('response', response)
      setFormData({...response.data.partner})
      console.log('formData', formData)
    })
    .catch((err) => {
      console.log('Error!')
    })
  }

  function createPartner() {
    try {
      axiosInstance
      .post("api/partners", formData)
      .then((response) => {
        history.push('/partners/all-partners')
      })
      .catch((err) => {
        console.log('Error!')
        setFormError(err.response.data.message)
      })
      
    } catch (error) {
      console.log('Something went wrong!')
    }
  }

  function updateMember(memberId) {
    try {
      axiosInstance
      .patch(`api/partners/${memberId}`, formData)
      .then((response) => {
        setFormSuccess('Partner has been updated!')
      })
      .catch((err) => {
        console.log('Error!')
        setFormError(err.response.data.message)
      })
      
    } catch (error) {
      setFormError('Something went wrong!')
    }
  }

  useEffect(() => {
    if(id) {
      getPartnerById(id)
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if(id) {
      updateMember(id)
    } else {
      createPartner()
    }
  };


  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new partner</h5>
        
        {formError && (
          <Alert variant='danger'>
            {formError}
          </Alert>
        )}

        {formSuccess && (
          <Alert variant='success'>
            {formSuccess}
          </Alert>
        )}

        <Form 
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>
          <Row>
            {/* Name */}
            <Col md={6} className="mb-3">
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Sort ID */}
            <Col md={6} className="mb-3">
              <Form.Group id="sortId">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Partner position in list"
                  name="sortId"
                  value={formData.sortId}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col sm={9} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Partner Type</Form.Label>
              <Form.Select
                required
                name="partnerType"
                value={formData.partnerType}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select partner type
                </option>
                <option value="Major Research Partners">Major Research Partners</option>
                <option value="Major Clietns (Local)">Major Clietns (Local)</option>
                <option value="Major Clients (Global)">Major Clients (Global)</option>
              </Form.Select>
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
