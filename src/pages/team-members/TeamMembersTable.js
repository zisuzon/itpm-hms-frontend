import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Card, Table, Dropdown, ButtonGroup, Alert } from '@themesberg/react-bootstrap';
import { Routes } from "../../routes";
import ConfirmationModal from '../components/ConfirmModal'
import axiosInstance from '../../axios'


export const TeamMembersTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tempDeleteMember, setTempDeleteMember] = useState({});
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');
  const confirmModalText = `Are you sure you want to delete the member ${tempDeleteMember?.name}?`

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (tempDeleteMember) => {
    setTempDeleteMember(tempDeleteMember)
    setShowModal(true);
  }

  function getAllTeamMember() {
    axiosInstance
    .get("api/team-members")
    .then((response) => {
      setTeamMembers(response.data.teamMembers)
    })
    .catch((err) => {
      console.log('Error!')
    })
  }

  useEffect(() => {
    getAllTeamMember()
  }, []);

  const handleConfirmation = () => {
    handleCloseModal(); // Close the modal after the action is confirmed.

    axiosInstance
    .delete(`api/team-members/${tempDeleteMember._id}`)
    .then((response) => {
      getAllTeamMember()
      setDeleteSuccessMsg(response.data.message)
    })
    .catch((err) => {
      console.log('Error!')
    })
  };

  const TableRow = (props) => {
    const { sortId, name, designation, _id } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{sortId}</Card.Link>
        </td>
        <td className="fw-bold">
          {name}
        </td>
        <td>{designation}</td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              <Dropdown.Item as={Link} to={`/team-members/edit/${_id}`}>Edit</Dropdown.Item>
              <Dropdown.Item
                as="button" 
                onClick={() => handleShowModal({ name, _id })}
                className="text-danger"
              >Delete</Dropdown.Item>
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
                <th className="border-0">#</th>
                <th className="border-0">Name</th>
                <th className="border-0">Designation</th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(tm => <TableRow key={`team-member-${tm._id}`} {...tm} />)}
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