import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faSearch,
  faUsers,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";
import {
  Row,
  Col,
  Card,
  Table,
  Dropdown,
  ButtonGroup,
  Alert,
  Form,
  InputGroup,
  Button,
  Badge,
} from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import ConfirmationModal from "../components/ConfirmModal";
import axiosInstance from "../../axios";

export const DoctorTeamTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [tempDeleteTeam, setTempDeleteTeam] = useState({});
  const [teams, setTeams] = useState([]);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteTeam) => {
    setTempDeleteTeam(tempDeleteTeam);
    setShowModal(true);
  };

  // General Search
  const handleSearch = (event) => {
    const searchText = event.target.value;
    setSearchTerm(searchText);

    if (!searchText && !departmentFilter) {
      setSearchResults(teams);
      return;
    }

    const filteredResults = teams.filter((team) => {
      const matchesSearch =
        !searchText ||
        team.teamName?.toLowerCase().includes(searchText.toLowerCase()) ||
        team.teamCode?.toLowerCase().includes(searchText.toLowerCase()) ||
        team.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        team.teamLead?.name?.toLowerCase().includes(searchText.toLowerCase());

      const matchesDepartment =
        !departmentFilter ||
        departmentFilter === "All" ||
        team.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });

    setSearchResults(filteredResults);
  };

  // Filter by Department
  const handleDepartmentFilter = (e) => {
    const selectedDepartment = e.target.value;
    setDepartmentFilter(selectedDepartment);

    if (selectedDepartment === "All") {
      setSearchResults(teams);
      return;
    }

    const filteredResults = teams.filter((team) => {
      const matchesSearch =
        !searchTerm ||
        team.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.teamCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.teamLead?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = team.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });

    setSearchResults(filteredResults);
  };

  const getAllDoctorTeams = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("api/doctor-teams");
      setTeams(response.data.teams);
      setSearchResults(response.data.teams);
    } catch (err) {
      console.log("Error fetching doctor teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDoctorTeams();
  }, []);

  const handleConfirmation = async () => {
    handleCloseModal();

    try {
      const response = await axiosInstance.delete(
        `api/doctor-teams/${tempDeleteTeam._id}`
      );
      getAllDoctorTeams();
      setDeleteSuccessMsg(
        response.data.message || "Team deleted successfully!"
      );
    } catch (err) {
      console.log("Error deleting team:", err);
      setDeleteSuccessMsg("Failed to delete team");
    }
  };

  const TableRow = (props) => {
    const {
      _id,
      teamName,
      teamCode,
      department,
      teamLead,
      doctors,
      patients,
      isActive,
      teamSize,
      patientCount,
    } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
            {teamCode}
          </Card.Link>
        </td>
        <td className="fw-bold">{teamName}</td>
        <td>
          <Badge bg="secondary" className="text-white">
            {department}
          </Badge>
        </td>
        <td>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            {teamLead?.name || "N/A"}
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            {teamSize || doctors?.length || 0} doctors
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            {patientCount || patients?.length || 0} patients
          </div>
        </td>
        <td>
          <Badge bg={isActive ? "success" : "danger"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              <Dropdown.Item as={Link} to={`/doctor-teams/edit/${_id}`}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => handleShowModal({ _id, teamName })}
                className="text-danger"
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  const confirmModalText = `Are you sure you want to delete the team "${tempDeleteTeam?.teamName}"?`;

  return (
    <>
      <Row>
        {/* Search */}
        <Col md={5} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search teams, codes, departments..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>

        {/* Department Filter */}
        <Col md={5} className="mb-3">
          <Form.Select
            value={departmentFilter}
            onChange={handleDepartmentFilter}
          >
            <option value="">All Departments</option>
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
        </Col>

        <Col md={2} className="mb-3">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSearchResults(teams);
              setDepartmentFilter("");
              setSearchTerm("");
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>

      <br />

      {/* Table */}
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0">
          {deleteSuccessMsg && (
            <Alert
              variant="success"
              onClose={() => setDeleteSuccessMsg("")}
              dismissible
            >
              {deleteSuccessMsg}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table
              responsive
              className="table-centered table-nowrap rounded mb-0"
            >
              <thead className="thead-light">
                <tr>
                  <th className="border-0">Team Code</th>
                  <th className="border-0">Team Name</th>
                  <th className="border-0">Department</th>
                  <th className="border-0">Team Lead</th>
                  <th className="border-0">Doctors</th>
                  <th className="border-0">Patients</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {teams.length === 0
                        ? "No doctor teams found"
                        : "No teams match your search criteria"}
                    </td>
                  </tr>
                ) : (
                  searchResults.map((team) => (
                    <TableRow key={`team-${team._id}`} {...team} />
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmation}
        message={confirmModalText}
      />
    </>
  );
};
