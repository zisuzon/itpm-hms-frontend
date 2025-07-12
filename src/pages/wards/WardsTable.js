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
  Button,
  Form,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import ConfirmationModal from "../components/ConfirmModal";
import axiosInstance from "../../axios";

export const WardsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [wards, setWards] = useState([]);
  const [tempDeleteWard, setTempDeleteWard] = useState({});
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const confirmModalText = `Are you sure you want to delete ${tempDeleteWard?.name}?`;
  const [searchTerm, setSearchTerm] = useState("");
  const [researchSelectionTerm, setResearchSelectionTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // General Search
  const handleSearch = (event) => {
    const searchText = event.target.value;

    setSearchTerm(searchText);
    if (!searchText) {
      setSearchResults(wards);
      return;
    }

    const filteredResults = wards.filter((item) => {
      return (
        item?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.wardType.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setSearchResults(filteredResults);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteWard) => {
    setTempDeleteWard(tempDeleteWard);
    setShowModal(true);
  };

  function getAllWards() {
    axiosInstance
      .get("api/wards")
      .then((response) => {
        setWards(response.data.wards);
        setSearchResults(response.data.wards);
      })
      .catch((err) => {
        console.error("Error getting all wards!");
      });
  }

  useEffect(() => {
    getAllWards();
  }, []);

  const handleConfirmation = () => {
    handleCloseModal(); // Close the modal after the action is confirmed.

    axiosInstance
      .delete(`api/wards/${tempDeleteWard._id}`)
      .then((response) => {
        getAllWards();
        setDeleteSuccessMsg(response.data.message);
      })
      .catch((err) => {
        console.error("Error deleting ward!");
      });
  };

  const TableRow = (props) => {
    const { name, type, totalBeds, totalOccupiedBeds, wardGender, _id } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
            {_id ? `${_id.substring(0, 2)}...` : ""}
          </Card.Link>
        </td>
        <td className="fw-bold">{name}</td>
        <td>{type}</td>
        <td>{totalBeds}</td>
        <td>{totalOccupiedBeds}</td>
        <td>{wardGender}</td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              <Dropdown.Item as={Link} to={`/wards/edit/${_id}`}>
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
        <Col md={5} className="mb-3">
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

        <Col md={2} className="mb-3">
          <Button
            variant="close"
            className="m-1"
            onClick={() => {
              setSearchResults(wards);
              setResearchSelectionTerm("All");
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
                <th className="border-0">Ward Name</th>
                <th className="border-0">Ward type</th>
                <th className="border-0">Total Beds</th>
                <th className="border-0">Occupied Beds</th>
                <th className="border-0">Ward Gender</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((tm) => (
                <TableRow key={`team-member-${tm._id}`} {...tm} />
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
