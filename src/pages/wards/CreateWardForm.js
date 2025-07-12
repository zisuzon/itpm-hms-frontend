import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Alert,
} from "@themesberg/react-bootstrap";
import axiosInstance from "../../axios";

export const CreateWardForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    totalBeds: "",
    totalOccupiedBeds: "",
    wardGender: "",
  });

  function getWardById(wardId) {
    axiosInstance
      .get(`api/wards/${wardId}`)
      .then((response) => {
        console.log("response", response);
        setFormData({ ...response.data.ward });
        console.log("formData", formData);
      })
      .catch((err) => {
        console.log("Error getting ward by id!");
      });
  }

  function createWard() {
    const payloadFormData = {
      name: formData.name,
      type: formData.type,
      totalBeds: parseInt(formData.totalBeds),
      totalOccupiedBeds: parseInt(formData.totalOccupiedBeds),
      wardGender: formData.wardGender,
    };

    try {
      axiosInstance
        .post("api/wards", payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          history.push("/wards/all-wards");
        })
        .catch((err) => {
          console.log("Error!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      console.log("Something went wrong!");
    }
  }

  function updateWard(wardId) {
    const payloadFormData = new FormData();
    payloadFormData.append("name", formData.name);
    payloadFormData.append("totalBeds", formData.totalBeds);
    payloadFormData.append("totalOccupiedBeds", formData.totalOccupiedBeds);
    payloadFormData.append("wardGender", formData.wardGender);

    try {
      axiosInstance
        .patch(`api/wards/${wardId}`, payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setFormSuccess("Ward has been updated!");
        })
        .catch((err) => {
          console.log("Error!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      setFormError("Something went wrong!");
    }
  }

  useEffect(() => {
    if (id) {
      getWardById(id);
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

    if (id) {
      updateWard(id);
    } else {
      createWard();
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Add new Ward</h5>

        {formError && <Alert variant="danger">{formError}</Alert>}

        {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            {/* Name */}
            <Col md={6} className="mb-3">
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  placeholder="Ward name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Type */}
            <Col md={6} className="mb-3">
              <Form.Group id="totalBeds">
                <Form.Label>Ward Type</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Ward type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Total Beds */}
            <Col md={6} className="mb-3">
              {/* Total Beds */}
              <Form.Group id="totalBeds">
                <Form.Label>Total Beds</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Total beds"
                  name="totalBeds"
                  value={formData.totalBeds}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              {/* Total Occupied Beds */}
              <Form.Group id="totalOccupiedBeds">
                <Form.Label>Total occupied beds</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Total occupied beds (0)"
                  name="totalOccupiedBeds"
                  value={formData.totalOccupiedBeds}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Ward Type</Form.Label>
                <Form.Select
                  required
                  name="wardGender"
                  value={formData.wardGender}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select ward type
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">
              Save All
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
