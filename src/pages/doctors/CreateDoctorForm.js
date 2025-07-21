import React, { useState, useEffect } from "react";
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
import { useToast } from "../../shared/context/toast-context";

// {
//   "name": "Dr. Philip",
//   "licence": "MD789022",
//   "designation": "Junior Consultant",
//   "department": "Medicine",
//   "teamId": "TEAM003",
//   "contact": "+1987654331",
//   "email": "philip@hospital.com",
//   "address": "456 Southmead Hospital Ave, City, State",
//   "isActive": true
// }

export const CreateDoctorForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const { success, error } = useToast();

  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [doctorTeams, setDoctorTeams] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    licence: "",
    designation: "",
    department: "",
    teamId: "",
    contact: "",
    email: "",
    address: "",
    isActive: true,
  });

  function getDoctorById(doctorId) {
    axiosInstance
      .get(`api/doctors/${doctorId}`)
      .then((response) => {
        console.log("response", response);
        setFormData({ ...response.data.doctor });
        console.log("formData", formData);
      })
      .catch((err) => {
        console.log("Error getting doctor by id!");
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
        error("Failed to load doctor teams");
      });
  }

  function createDoctor() {
    const payloadFormData = {
      name: formData.name,
      licence: formData.licence,
      designation: formData.designation,
      department: formData.department,
      teamId: formData.teamId,
      contact: formData.contact,
      email: formData.email,
      address: formData.address,
      isActive: formData.isActive,
    };

    try {
      axiosInstance
        .post("api/doctors", payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          success("Doctor created successfully");
          history.push("/doctors/all-doctors");
        })
        .catch((err) => {
          console.log("Error creating doctor!");
          const errorMessage =
            err.response?.data?.message || "Error creating doctor!";
          setFormError(errorMessage);
          error(errorMessage);
        });
    } catch (error) {
      console.log("Something went wrong!");
      setFormError("Something went wrong!");
      error("Something went wrong!");
    }
  }

  function updateDoctor(doctorId) {
    const payloadFormData = {
      name: formData.name,
      licence: formData.licence,
      designation: formData.designation,
      department: formData.department,
      teamId: formData.teamId,
      contact: formData.contact,
      email: formData.email,
      address: formData.address,
      isActive: formData.isActive,
    };

    try {
      axiosInstance
        .patch(`api/doctors/${doctorId}`, payloadFormData, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setFormSuccess("Doctor has been updated!");
          success("Doctor updated successfully");
        })
        .catch((err) => {
          console.log("Error updating doctor!");
          const errorMessage =
            err.response?.data?.message || "Error updating doctor!";
          setFormError(errorMessage);
          error(errorMessage);
        });
    } catch (error) {
      setFormError("Something went wrong!");
      error("Something went wrong!");
    }
  }

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
      updateDoctor(id);
    } else {
      createDoctor();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    getAllDoctorTeams();
    if (id) {
      getDoctorById(id);
    }
  }, []);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">{id ? "Edit Doctor" : "Add new Doctor"}</h5>

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
                  placeholder="Doctor's Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Licence */}
            <Col md={6} className="mb-3">
              <Form.Group id="licence">
                <Form.Label>Licence Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="licence"
                  placeholder="e.g., MD789022"
                  value={formData.licence}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Designation */}
            <Col md={6} className="mb-3">
              <Form.Group id="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Select
                  required
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select designation
                  </option>
                  <option value="Junior Consultant">Junior Consultant</option>
                  <option value="Senior Consultant">Senior Consultant</option>
                  <option value="Specialist">Specialist</option>
                  <option value="Resident">Resident</option>
                  <option value="Intern">Intern</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* Department */}
            <Col md={6} className="mb-3">
              <Form.Group id="department">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  required
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select department
                  </option>
                  <option value="Medicine">Medicine</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Emergency">Emergency</option>
                  <option value="ICU">ICU</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Pathology">Pathology</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Contact */}
            <Col md={6} className="mb-3">
              <Form.Group id="contact">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="contact"
                  placeholder="e.g., +1987654331"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            {/* Email */}
            <Col md={6} className="mb-3">
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  placeholder="e.g., doctor@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Team Assignment */}
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="teamId">
                <Form.Label>Assigned Team</Form.Label>
                <Form.Select
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select team (optional)
                  </option>
                  {doctorTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} - {team.department}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            {/* Active Status */}
            <Col md={6} className="mb-3">
              <Form.Group id="isActive">
                <Form.Label>Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  label={formData.isActive ? "Active" : "Inactive"}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Address */}
          <Row>
            <Col className="mb-3">
              <Form.Group id="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">
              {id ? "Update Doctor" : "Save Doctor"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
