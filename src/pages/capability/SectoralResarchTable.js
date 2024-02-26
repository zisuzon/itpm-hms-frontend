import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Card, Table, Dropdown, ButtonGroup, Alert } from '@themesberg/react-bootstrap';
import { Routes } from "../../routes";
import { teamMembers } from "../../data/tables";
import ConfirmationModal from '../../pages/components/ConfirmModal'
import axiosInstance from '../../axios'
import DOMPurify from 'dompurify';

const sanitizeHTML = (html) => ({
  __html: DOMPurify.sanitize(html),
});


export const SectoralResarchTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [tempDeleteSectoralResearch, setTempDeleteSectoralResearch] = useState({});
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteSectoralResearch) => {
    setTempDeleteSectoralResearch(tempDeleteSectoralResearch)
    setShowModal(true);
  }
  const [sectoralResearch, setSectoralResearch] = useState([]);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');

  function getAllSectoralResearch() {
    axiosInstance
    .get("api/sectoral-and-research")
    .then((response) => {
      setSectoralResearch(response.data.sectoralResearch)
    })
    .catch((err) => {
      console.log('Error!')
    })
  }

  useEffect(() => {
    getAllSectoralResearch()
  }, []);

  const handleConfirmation = () => {
    console.log('tempDeleteSectoralResearch', tempDeleteSectoralResearch)
    handleCloseModal(); // Close the modal after the action is confirmed.

    axiosInstance
    .delete(`api/sectoral-and-research/${tempDeleteSectoralResearch.id}`)
    .then((response) => {
      getAllSectoralResearch()
      setDeleteSuccessMsg(response.data.message)
    })
    .catch((err) => {
      console.log('Error!')
    })
  };

  const TableRow = (props) => {
    const { sortId, studyTitle, studyObjective, researchMethology, _id } = props;

    const removeMarkup = (htmlString) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || '';
    }

    const formatTableText = (text) => {
      const truncateDots = text.length >= 20 ? '...' : ''
      // Removing markup just to show text in table.
      const formattedText = removeMarkup(text).substring(0, 20)
      return `${formattedText} ${truncateDots}`
    }

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{sortId}</Card.Link>
        </td>
        <td 
          className="fw-bold"
          dangerouslySetInnerHTML={{ __html: formatTableText(studyTitle) }}
        ></td>
        <td
         dangerouslySetInnerHTML={{ __html: formatTableText(studyObjective) }}
        ></td>
        <td
          dangerouslySetInnerHTML={{ __html: formatTableText(researchMethology) }}
        ></td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              <Dropdown.Item href="#action">Edit</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => handleShowModal({id: _id})} className="text-danger">Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0">
          {deleteSuccessMsg && (
            <Alert variant='success'>
              {deleteSuccessMsg}
            </Alert>
          )}
          <Table responsive className="table-centered table-nowrap rounded mb-0">
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
              {sectoralResearch.map((tm, index ) => <TableRow key={`sectoral-research-${index}`} {...tm} sortId={index + 1} />)}
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