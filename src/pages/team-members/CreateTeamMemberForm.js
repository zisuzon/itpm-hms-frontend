
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Col, Row, Card, Form, Button, Alert } from '@themesberg/react-bootstrap';
import axiosInstance from '../../axios'

export const CreateTeamMemberForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const editorRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    sortId: '',
    image: '',
    listImage: '',
    address: '',
    email: '',
    phone: '',
    designation: '',
  });

  function getTeamMemberById(memberId) {
    axiosInstance
    .get(`api/team-members/${memberId}`)
    .then((response) => {
      console.log('response', response)
      setFormData({...response.data.member})
      console.log('formData', formData)
    })
    .catch((err) => {
      console.log('Error!')
    })
  }

  function createMember() {
    try {
      axiosInstance
      .post("api/team-members", formData)
      .then((response) => {
        history.push('/team-members/all-team-members')
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
      .patch(`api/team-members/${memberId}`, formData)
      .then((response) => {
        setFormSuccess('Member has been updated!')
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
      getTeamMemberById(id)
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditorChange = (content, editor, name) => {
    setFormData({
      ...formData,
      [name]: content,
    });
  };
  
  const handleSubmit = (event) => {
    setIsDescriptionValid(true)
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if(!formData.description) {
      setIsDescriptionValid(false)
    }

    if(id) {
      updateMember(id)
    } else {
      createMember()
    }
  };


  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new team member</h5>
        
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
                  placeholder="Position number of the member in list"
                  name="sortId"
                  value={formData.sortId}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            {/* Image URL */}
            <Col md={6} className="mb-3">
              <Form.Group id="imageUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="https://url-of-the-profile-image.com" 
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Designation */}
            <Col md={6} className="mb-3">
              <Form.Group id="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* List Image URL */}
            <Col md={6} className="mb-3">
              <Form.Group id="listImageUrl">
                <Form.Label>List Image URL</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="https://url-of-the-profile-image.com" 
                  name="listImage"
                  value={formData.listImage}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6} className="mb-3">
              <Form.Group id="emal">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            {/* Phone */}
            <Col md={6} className="mb-3">
              <Form.Group id="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Address */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="shortDescription">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Short Description */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="shortDescription">
                <Form.Label>Short Description</Form.Label>
                <Form.Control
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="description">
                <Form.Label>Description</Form.Label>
                <div className={!isDescriptionValid ? 'invalid-editor' : ''}>
                  <Editor
                  value={formData.description}
                    apiKey='q6tut9ishckw8kfsto8fek4zkak8ttiiu06x5wgev1rl0uzl'
                    onInit={(evt, editor) => editorRef.current = editor}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    onEditorChange={(content, editor) => handleEditorChange(content, editor, 'description')}
                  />
                </div>
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
