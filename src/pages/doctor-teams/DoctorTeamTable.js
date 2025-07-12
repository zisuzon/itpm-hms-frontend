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
import { teamMembers } from "../../data/tables";
import ConfirmationModal from "../components/ConfirmModal";
import axiosInstance from "../../axios";
import DOMPurify from "dompurify";

// const sanitizeHTML = (html) => ({
//   __html: DOMPurify.sanitize(html),
// });

export const DoctorTeamTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [tempDeleteSectoralResearch, setTempDeleteSectoralResearch] = useState(
    {}
  );
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteSectoralResearch) => {
    setTempDeleteSectoralResearch(tempDeleteSectoralResearch);
    setShowModal(true);
  };
  const [sectoralResearch, setSectoralResearch] = useState([]);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [researchSelectionTerm, setResearchSelectionTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // General Search
  const handleSearch = (event) => {
    const searchText = event.target.value;

    setSearchTerm(searchText);
    if (!searchText) {
      setSearchResults(sectoralResearch);
      return;
    }

    const filteredResults = sectoralResearch.filter((item) => {
      return (
        item?.researchMethology
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item?.sectoralResearchCategory
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item?.studyObjective.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.studyTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setSearchResults(filteredResults);
  };

  // Search by Category
  const handleResearchCategory = (e) => {
    const researchCategorySelection = e.target.value;

    setResearchSelectionTerm(researchCategorySelection);

    if (researchCategorySelection === "All") {
      setSearchResults(sectoralResearch);
      return;
    }

    const filteredResults = sectoralResearch.filter((item) => {
      return item?.sectoralResearchCategory === researchCategorySelection;
    });

    setSearchResults(filteredResults);
  };

  function getAllSectoralResearch() {
    axiosInstance
      .get("api/sectoral-and-research")
      .then((response) => {
        setSectoralResearch(response.data.sectoralResearch);
        setSearchResults(response.data.sectoralResearch);
      })
      .catch((err) => {
        console.log("Error!");
      });
  }

  useEffect(() => {
    getAllSectoralResearch();
  }, []);

  const handleConfirmation = () => {
    console.log("tempDeleteSectoralResearch", tempDeleteSectoralResearch);
    handleCloseModal(); // Close the modal after the action is confirmed.

    axiosInstance
      .delete(`api/sectoral-and-research/${tempDeleteSectoralResearch.id}`)
      .then((response) => {
        getAllSectoralResearch();
        setDeleteSuccessMsg(response.data.message);
      })
      .catch((err) => {
        console.log("Error!");
      });
  };

  const TableRow = (props) => {
    const { sortId, studyTitle, studyObjective, researchMethology, _id } =
      props;

    const removeMarkup = (htmlString) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || "";
    };

    const formatTableText = (text) => {
      const truncateDots = text.length >= 20 ? "..." : "";
      // Removing markup just to show text in table.
      const formattedText = removeMarkup(text).substring(0, 20);
      return `${formattedText} ${truncateDots}`;
    };

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">
            {sortId}
          </Card.Link>
        </td>
        <td
          className="fw-bold"
          dangerouslySetInnerHTML={{ __html: formatTableText(studyTitle) }}
        ></td>
        <td
          dangerouslySetInnerHTML={{ __html: formatTableText(studyObjective) }}
        ></td>
        <td
          dangerouslySetInnerHTML={{
            __html: formatTableText(researchMethology),
          }}
        ></td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              {/* <Dropdown.Item href="#action">Edit</Dropdown.Item> */}
              <Dropdown.Item as={Link} to={`/capability/edit/${_id}`}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => handleShowModal({ id: _id })}
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
        {/* Research Type DropDown */}
        <Col md={5} className="mb-3">
          <Form.Group id="sectoralResearchCategory" className="mb-3">
            <Form.Select
              required
              name="sectoralResearchCategory"
              value={researchSelectionTerm}
              onChange={handleResearchCategory}
            >
              <option defaultValue>All</option>
              <option>Health and Nutrition</option>
              <option>Education</option>
              <option>Governance, Proverty and Gender Issues</option>
              <option>Trade and Industry</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={2} className="mb-3">
          <Button
            variant="close"
            className="m-1"
            onClick={() => {
              setSearchResults(sectoralResearch);
              setResearchSelectionTerm("All");
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
                <th className="border-0">Study Title</th>
                <th className="border-0">Study Objective</th>
                <th className="border-0">Research Methodology</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((tm, index) => (
                <TableRow
                  key={`sectoral-research-${index}`}
                  {...tm}
                  sortId={index + 1}
                />
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
