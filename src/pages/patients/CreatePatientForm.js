import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Alert,
  Image,
} from "@themesberg/react-bootstrap";
import axiosInstance from "../../axios";
import PlaceholderPP from "../../assets/img/pp-placeholder.jpeg";
import { BE_IMAGE_PATH } from "../../utils/constants";

export const CreatePatientForm = () => {
  const { id } = useParams();
  const history = useHistory();

  // {
  //   "name": "John Doe",
  //   "dateOfBirth": "1990-05-15",
  //   "gender": "Male",
  //   "contact": "+1234567890",
  //   "emergencyContact": "+1234567891",
  //   "history": "Previous heart condition",
  //   "assignedWard": "ward_id_here",
  //   "assignedTeam": "team_id_here"
  // }

  const editorRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    emergencyContact: "",
    history: "",
    assignedWard: "",
    assignedTeam: "",
  });
  const [wards, setWards] = useState([]);
  const [doctorTeams, setDoctorTeams] = useState([]);

  function getPatientById(patientId) {
    axiosInstance
      .get(`api/patients/${patientId}`)
      .then((response) => {
        console.log("response", response);
        setFormData({ ...response.data.patient });
        console.log("formData", formData);
      })
      .catch((err) => {
        console.log("Error getting patient by id!");
      });
  }

  function getAllWards() {
    axiosInstance
      .get("api/wards")
      .then((response) => {
        setWards(response.data.wards);
      })
      .catch((err) => {
        console.error("Error getting all wards!");
      });
  }

  function getAllDoctorTeams() {
    axiosInstance
      .get("api/doctor-teams")
      .then((response) => {
        setDoctorTeams(response.data.teams);
      })
      .catch((err) => {
        console.error("Error getting all doctor teams!");
      });
  }

  function createPatient() {
    const payloadFormData = {
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      contact: formData.contact,
      emergencyContact: formData.emergencyContact,
      history: formData.history,
      assignedWard: formData.assignedWard,
      assignedTeam: formData.assignedTeam,
    };

    try {
      axiosInstance
        .post("api/patients", payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          history.push("/patients/all-patients");
        })
        .catch((err) => {
          console.log("Error creating patient!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      console.log("Something went wrong!");
    }
  }

  function updatePatient(patientId) {
    const payloadFormData = {
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      contact: formData.contact,
      emergencyContact: formData.emergencyContact,
      history: formData.history,
      assignedWard: formData.assignedWard,
      assignedTeam: formData.assignedTeam,
    };

    try {
      axiosInstance
        .patch(`api/patients/${patientId}`, payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setFormSuccess("Patient has been updated!");
        })
        .catch((err) => {
          console.log("Error updating patient!");
          setFormError(err.response.data.message);
        });
    } catch (error) {
      setFormError("Something went wrong!");
    }
  }

  useEffect(() => {
    getAllWards();
    getAllDoctorTeams();
    if (id) {
      getPatientById(id);
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
    setIsDescriptionValid(true);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if (!formData.description) {
      setIsDescriptionValid(false);
    }

    if (id) {
      updatePatient(id);
    } else {
      createPatient();
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Admit new Patient</h5>

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
                  placeholder="Patient's Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Date of Birth */}
            <Col md={6} className="mb-3">
              <Form.Group id="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  required
                  type="date"
                  placeholder="Patient's Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            {/* Gender */}
            <Col md={6} className="mb-3">
              <Form.Group id="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6} className="mb-3">
              <Form.Group id="contact">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row></Row>

          <Row className="align-items-center">
            {/* Phone */}
            <Col md={6} className="mb-3">
              <Form.Group id="emergencyContact">
                <Form.Label>Emergency Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="emergencyContact"
                  placeholder="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Address */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group id="history">
                <Form.Label>History</Form.Label>
                <Form.Control
                  type="text"
                  name="history"
                  placeholder="Patient's History"
                  value={formData.history}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Assigned Ward */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group className="mb-3" id="assignedWard">
                <Form.Label>Assigned Ward</Form.Label>
                <Form.Select
                  required
                  name="assignedWard"
                  value={formData.assignedWard}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select ward
                  </option>
                  {wards.map((ward) => (
                    <option key={ward._id} value={ward._id}>
                      {ward.name} - {ward.wardGender}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Assigned Team */}
          <Row>
            <Col sm={9} className="mb-3">
              <Form.Group className="mb-3" id="assignedTeam">
                <Form.Label>Assigned Doctor Team</Form.Label>
                <Form.Select
                  required
                  name="assignedTeam"
                  value={formData.assignedTeam}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select team
                  </option>
                  {doctorTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team?.name} - {team?.department}
                    </option>
                  ))}
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
