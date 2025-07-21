import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Card,
  Table,
  Dropdown,
  ButtonGroup,
  Alert,
  Form,
  InputGroup,
  Button,
} from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import ConfirmationModal from "../components/ConfirmModal";
import axiosInstance from "../../axios";

export const PatientsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [tempDeleteMember, setTempDeleteMember] = useState({});
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const confirmModalText = `Are you sure you want to discharge the patient ${tempDeleteMember?.name}?`;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [wards, setWards] = useState([]);
  const [teams, setTeams] = useState([]);

  // General Search
  const handleSearch = (event) => {
    const searchText = event.target.value;

    setSearchTerm(searchText);
    if (!searchText) {
      setSearchResults(patients);
      return;
    }

    const filteredResults = patients.filter((item) => {
      const searchLower = searchText.toLowerCase();

      // Get ward name for search
      const wardName = getWardDisplayName(item.assignedWard);

      // Get team name for search
      const teamName = getTeamDisplayName(item.assignedTeam);

      return (
        item?.name?.toLowerCase().includes(searchLower) ||
        item?.gender?.toLowerCase().includes(searchLower) ||
        item?.contact?.toLowerCase().includes(searchLower) ||
        item?.emergencyContact?.toLowerCase().includes(searchLower) ||
        wardName.toLowerCase().includes(searchLower) ||
        teamName.toLowerCase().includes(searchLower)
      );
    });

    setSearchResults(filteredResults);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteMember) => {
    setTempDeleteMember(tempDeleteMember);
    setShowModal(true);
  };

  const getAllPatients = async () => {
    try {
      const response = await axiosInstance.get("api/patients");
      setPatients(response.data.patients);
      setSearchResults(response.data.patients);
    } catch (err) {
      console.log("Error fetching patients:", err);
    }
  };

  const getAllWards = async () => {
    try {
      const response = await axiosInstance.get("api/wards");
      setWards(response.data.wards);
    } catch (err) {
      console.log("Error fetching wards:", err);
    }
  };

  const getAllTeams = async () => {
    try {
      const response = await axiosInstance.get("api/doctor-teams");
      setTeams(response.data.teams);
    } catch (err) {
      console.log("Error fetching teams:", err);
    }
  };

  useEffect(() => {
    getAllPatients();
    getAllWards();
    getAllTeams();
  }, []);

  // Helper function to get ward display name
  const getWardDisplayName = (ward) => {
    if (!ward) return "Not Assigned";

    // If ward is already populated (object with name)
    if (typeof ward === "object" && ward.name) {
      return ward.name;
    }

    // If ward is an ID, find the ward by ID
    if (typeof ward === "string") {
      const foundWard = wards.find((w) => w._id === ward);
      return foundWard ? foundWard.name : "Unknown Ward";
    }

    return "Unknown Ward";
  };

  // Helper function to get team display name
  const getTeamDisplayName = (team) => {
    if (!team) return "Not Assigned";

    // If team is already populated (object with teamName)
    if (typeof team === "object" && team.teamName) {
      return team.teamName;
    }

    // If team is an ID, find the team by ID
    if (typeof team === "string") {
      const foundTeam = teams.find((t) => t._id === team);
      return foundTeam ? foundTeam.teamName : "Unknown Team";
    }

    return "Unknown Team";
  };

  const handleConfirmation = () => {
    handleCloseModal(); // Close the modal after the action is confirmed.

    axiosInstance
      .delete(`api/patients/${tempDeleteMember._id}`)
      .then((response) => {
        getAllPatients();
        setDeleteSuccessMsg(response.data.message);
      })
      .catch((err) => {
        console.log("Error!");
      });
  };

  const TableRow = (props) => {
    const {
      name,
      gender,
      contact,
      emergencyContact,
      history,
      assignedWard,
      assignedTeam,
      _id,
    } = props;

    console.log("assignedTeam", assignedTeam);
    console.log("assignedWard", assignedWard);

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
            {_id ? `${_id.substring(0, 8)}...` : ""}
          </Card.Link>
        </td>
        <td className="fw-bold">{name}</td>
        <td>{gender}</td>
        <td>{contact || "N/A"}</td>
        <td>{emergencyContact || "N/A"}</td>
        <td>
          <span className="badge bg-info">
            {getWardDisplayName(assignedWard)}
          </span>
        </td>
        <td>
          <span className="badge bg-secondary">
            {getTeamDisplayName(assignedTeam)}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              <Dropdown.Item as={Link} to={`/patients/edit/${_id}`}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => handleShowModal({ name, _id })}
                className="text-danger"
              >
                Discharge
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Row>
        {/* Search */}
        <Col md={8} className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search patients, wards, teams..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>

        <Col md={4} className="mb-3">
          <Button
            variant="close"
            className="m-1"
            onClick={() => {
              setSearchResults(patients);
              setSearchTerm("");
            }}
          ></Button>
        </Col>
      </Row>

      <br />

      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0">
          {deleteSuccessMsg && (
            <Alert variant="success">{deleteSuccessMsg}</Alert>
          )}
          <Table
            responsive
            className="table-centered table-nowrap rounded mb-0"
          >
            <thead className="thead-light">
              <tr>
                <th className="border-0">ID</th>
                <th className="border-0">Name</th>
                <th className="border-0">Gender</th>
                <th className="border-0">Contact</th>
                <th className="border-0">Emergency Contact</th>
                <th className="border-0">Ward</th>
                <th className="border-0">Doctor Team</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((p) => (
                <TableRow key={`patient-${p._id}`} {...p} />
              ))}
            </tbody>
          </Table>
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
