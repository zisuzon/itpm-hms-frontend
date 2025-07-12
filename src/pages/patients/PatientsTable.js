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
  const confirmModalText = `Are you sure you want to delete the member ${tempDeleteMember?.name}?`;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // General Search
  const handleSearch = (event) => {
    const searchText = event.target.value;

    setSearchTerm(searchText);
    if (!searchText) {
      setSearchResults(patients);
      return;
    }

    const filteredResults = patients.filter((item) => {
      return (
        item?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.designation.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setSearchResults(filteredResults);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteMember) => {
    setTempDeleteMember(tempDeleteMember);
    setShowModal(true);
  };

  function getAllPatients() {
    axiosInstance
      .get("api/patients")
      .then((response) => {
        setPatients(response.data.patients.sort((a, b) => a.sortId - b.sortId));
        setSearchResults(
          response.data.patients.sort((a, b) => a.sortId - b.sortId)
        );
      })
      .catch((err) => {
        console.log("Error!");
      });
  }

  useEffect(() => {
    getAllPatients();
  }, []);

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
    const { sortId, name, designation, _id } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
            {sortId}
          </Card.Link>
        </td>
        <td className="fw-bold">{name}</td>
        <td>{designation}</td>
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
                Delete
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
              placeholder="Search"
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
                <th className="border-0">#</th>
                <th className="border-0">Name</th>
                <th className="border-0">Designation</th>
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
