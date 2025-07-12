import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
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
} from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import ConfirmationModal from "../components/ConfirmModal";
import axiosInstance from "../../axios";
import DOMPurify from "dompurify";

// const sanitizeHTML = (html) => ({
//   __html: DOMPurify.sanitize(html),
// });

export const DoctorTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [tempDeleteDoctor, setTempDeleteDoctor] = useState({});
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteDoctor) => {
    setTempDeleteDoctor(tempDeleteDoctor);
    setShowModal(true);
  };
  const [doctors, setDoctors] = useState([]);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // General Search
  const handleSearch = (event) => {
    const searchText = event.target.value;

    setSearchTerm(searchText);
    if (!searchText) {
      setSearchResults(doctors);
      return;
    }

    const filteredResults = doctors.filter((item) => {
      return (
        item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.designation?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.contact?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setSearchResults(filteredResults);
  };

  function getAllDoctors() {
    axiosInstance
      .get("api/doctors")
      .then((response) => {
        setDoctors(response.data.doctors);
        setSearchResults(response.data.doctors);
      })
      .catch((err) => {
        console.log("Error!");
      });
  }

  useEffect(() => {
    getAllDoctors();
  }, []);

  const handleConfirmation = () => {
    handleCloseModal(); // Close the modal after the action is confirmed.

    axiosInstance
      .delete(`api/doctors/${tempDeleteDoctor.id}`)
      .then((response) => {
        getAllDoctors();
        setDeleteSuccessMsg(response.data.message);
      })
      .catch((err) => {
        console.log("Error!");
      });
  };

  const TableRow = (props) => {
    const {
      name,
      designation,
      department,
      teamId,
      contact,
      email,
      isActive,
      _id,
    } = props;

    const removeMarkup = (htmlString) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || "";
    };

    const formatTableText = (text) => {
      if (!text || text.trim() === "") {
        return "N/A";
      }
      const truncateDots = text.length >= 20 ? "..." : "";
      // Removing markup just to show text in table.
      const formattedText = removeMarkup(text).substring(0, 20);
      return `${formattedText} ${truncateDots}`;
    };

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
            {_id ? `${_id.substring(0, 2)}...` : ""}
          </Card.Link>
        </td>
        <td
          className="fw-bold"
          dangerouslySetInnerHTML={{ __html: formatTableText(name) }}
        ></td>
        <td
          dangerouslySetInnerHTML={{ __html: formatTableText(designation) }}
        ></td>
        <td
          dangerouslySetInnerHTML={{
            __html: formatTableText(department),
          }}
        ></td>
        <td
          dangerouslySetInnerHTML={{
            __html: formatTableText(teamId),
          }}
        ></td>
        <td
          dangerouslySetInnerHTML={{
            __html: formatTableText(contact),
          }}
        ></td>
        <td
          dangerouslySetInnerHTML={{
            __html: formatTableText(email),
          }}
        ></td>
        <td>{isActive ? "Active" : "Inactive"}</td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              {/* <Dropdown.Item href="#action">Edit</Dropdown.Item> */}
              <Dropdown.Item as={Link} to={`/doctors/edit/${_id}`}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => handleShowModal({ id: _id })}
                className="text-danger"
              >
                Remove
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
              setSearchResults(doctors);
              setSearchTerm("");
            }}
          ></Button>
        </Col>
      </Row>

      <br />

      {/* Table */}
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
                <th className="border-0">Sl.</th>
                <th className="border-0">Name</th>
                <th className="border-0">Designation</th>
                <th className="border-0">Department</th>
                <th className="border-0">Team</th>
                <th className="border-0">Contact</th>
                <th className="border-0">Email</th>
                <th className="border-0">Status</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((tm, index) => (
                <TableRow key={`doctor-${index}`} {...tm} sortId={index + 1} />
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleConfirmation}
        message="Are you sure you want to delete the member?"
      />
    </>
  );
};
