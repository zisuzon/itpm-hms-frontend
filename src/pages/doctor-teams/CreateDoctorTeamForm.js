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
import "./CreateDoctorTeamForm.scss";

export const CreateDoctorTeamForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    teamName: "",
    teamCode: "",
    department: "",
    teamLead: "",
    doctors: [],
    description: "",
    isActive: true,
  });

  // Fetch all doctors for selection
  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("api/doctors");
      setDoctors(response.data.doctors);
    } catch (err) {
      console.log("Error fetching doctors:", err);
      setFormError("Failed to fetch doctors");
    }
  };

  // Get doctor team by ID for editing
  const getDoctorTeamById = async (teamId) => {
    try {
      const response = await axiosInstance.get(`api/doctor-teams/${teamId}`);
      const team = response.data.team;
      setFormData({
        teamName: team.teamName || "",
        teamCode: team.teamCode || "",
        department: team.department || "",
        teamLead: team.teamLead?._id || "",
        doctors: team.doctors?.map((doc) => doc._id) || [],
        description: team.description || "",
        isActive: team.isActive !== undefined ? team.isActive : true,
      });
    } catch (err) {
      console.log("Error fetching team:", err);
      setFormError("Failed to fetch team data");
    }
  };

  // Create new doctor team
  const createDoctorTeam = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("api/doctor-teams", formData);
      setFormSuccess("Doctor team created successfully!");
      setTimeout(() => {
        history.push("/doctor-teams/all-doctor-teams");
      }, 1500);
    } catch (err) {
      console.log("Error creating team:", err);
      setFormError(
        err.response?.data?.message || "Failed to create doctor team"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update existing doctor team
  const updateDoctorTeam = async (teamId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `api/doctor-teams/${teamId}`,
        formData
      );
      setFormSuccess("Doctor team updated successfully!");
      setTimeout(() => {
        history.push("/doctor-teams/all-doctor-teams");
      }, 1500);
    } catch (err) {
      console.log("Error updating team:", err);
      setFormError(
        err.response?.data?.message || "Failed to update doctor team"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    if (id) {
      updateDoctorTeam(id);
    } else {
      createDoctorTeam();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDoctorSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevState) => ({
      ...prevState,
      doctors: selectedOptions,
    }));
  };

  const handleTeamLeadChange = (e) => {
    const teamLeadId = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      teamLead: teamLeadId,
      // Remove team lead from doctors array if they were selected there
      doctors: prevState.doctors.filter((docId) => docId !== teamLeadId),
    }));
  };

  useEffect(() => {
    fetchDoctors();
    if (id) {
      getDoctorTeamById(id);
    }
  }, [id]);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">
          {id ? "Edit Doctor Team" : "Create Doctor Team"}
        </h5>

        {formError && <Alert variant="danger">{formError}</Alert>}
        {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Team Name *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="teamName"
                  placeholder="Enter team name"
                  value={formData.teamName}
                  onChange={handleChange}
                  isInvalid={validated && !formData.teamName}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a team name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Team Code *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="teamCode"
                  placeholder="Enter unique team code"
                  value={formData.teamCode}
                  onChange={handleChange}
                  isInvalid={validated && !formData.teamCode}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a team code.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department *</Form.Label>
                <Form.Select
                  required
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  isInvalid={validated && !formData.department}
                >
                  <option value="">Select department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Radiology">Radiology</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a department.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Team Lead *</Form.Label>
                <Form.Select
                  required
                  name="teamLead"
                  value={formData.teamLead}
                  onChange={handleTeamLeadChange}
                  isInvalid={validated && !formData.teamLead}
                >
                  <option value="">Select team lead</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.designation}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a team lead.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Team Members (Doctors) *</Form.Label>
                <Form.Select
                  multiple
                  name="doctors"
                  value={formData.doctors}
                  onChange={handleDoctorSelection}
                  isInvalid={validated && formData.doctors.length === 0}
                >
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.designation} ({doctor.department})
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Hold Ctrl (or Cmd on Mac) to select multiple doctors
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please select at least one team member.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Enter team description (optional)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  label="Team is active"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : id ? "Update Team" : "Create Team"}
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => history.push("/doctor-teams/all-doctor-teams")}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
