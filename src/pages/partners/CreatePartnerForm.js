
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row, Card, Form, Button, Alert } from '@themesberg/react-bootstrap';
import axiosInstance from '../../axios'
import PlaceholderPP from '../../assets/img/pp-placeholder.jpeg'
import {BE_IMAGE_PATH} from '../../utils/constants'

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
    partnerImage: '',
    partnerUrl: '',
  });

  // Image upload
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const maximumSize = 2 * 1024 * 1024 // 2MB

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
    if(!formData.partnerImage) {
      setFormError('Partner image missing!')
      return
    }

    const payloadFormData = new FormData()
    payloadFormData.append('name', formData.name)
    payloadFormData.append('partnerUrl', formData.partnerUrl)
    payloadFormData.append('partnerType', formData.partnerType)
    payloadFormData.append('sortId', formData.sortId)
    payloadFormData.append('partnerImage', formData.partnerImage)

    try {
      axiosInstance
      .post("api/partners", payloadFormData, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'multipart/form-data'
        }
      })
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
    if(!formData.partnerImage) {
      setFormError('Partner image missing!')
      return
    }

    const payloadFormData = new FormData()
    payloadFormData.append('name', formData.name)
    payloadFormData.append('partnerUrl', formData.partnerUrl)
    payloadFormData.append('partnerType', formData.partnerType)
    payloadFormData.append('sortId', formData.sortId)
    payloadFormData.append('partnerImage', formData.partnerImage)

    try {
      axiosInstance
      .patch(`api/partners/${memberId}`, payloadFormData, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'multipart/form-data'
        }
      })
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

  // Image upload
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result)
      setPreviewUrl(fileReader.result);
    };
    
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    if (!event.target.files || event.target.files.length > 1) {
      setFormError('Something went wrong with your upload!')
      return
    }

    const pickedFile = event.target.files[0];

    if(pickedFile.size >= maximumSize) {
      setFormError('Image size must not exceed 2MB!')
      return
    }
    
    setFile(pickedFile);
    setFormData({
      ...formData,
      partnerImage: pickedFile,
    });
  };

  function getImage() {
    if(previewUrl) {
      return previewUrl
    }

    if(formData?.partnerImage) {
      return `${BE_IMAGE_PATH}/${formData?.partnerImage}`
    }

    return PlaceholderPP
  }

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

        <Row>
          <Col md={4} className="mb-3">
            <Card style={{ width: '20rem', height: '12rem' }}>
              <Card.Img style={{ width: '20rem', height: '12rem' }} variant="top" src={getImage()} />
            </Card>
          </Col>
          <Col md={6} className="mt-3">
            <Button variant="outline-primary" onClick={pickImageHandler}>Pick Photo</Button>
          </Col>
        </Row>

        <Form 
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>
          <Row>
            {/* Image upload input form */}
            <input
              id='image'
              ref={filePickerRef}
              style={{ display: 'none' }}
              type="file"
              accept=".jpg,.png,.jpeg"
              onChange={pickedHandler}
            />
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

          <Row>
            {/* Partner URL */}
            <Col md={6} className="mb-3">
              <Form.Group id="partnerUrl">
                <Form.Label>Partner Url</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Partner url"
                  name="partnerUrl"
                  value={formData.partnerUrl}
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
