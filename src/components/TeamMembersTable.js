import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Card, Table, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import { teamMembers } from "../data/tables";

export const TeamMembersTable = () => {
  const TableRow = (props) => {
    const { sortId, name, email, designation, phone } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{sortId}</Card.Link>
        </td>
        <td className="fw-bold">
          {name}
        </td>
        <td>{designation}</td>
        <td>{email}</td>
        <td>{phone}</td>
        <td>
          <Dropdown as={ButtonGroup} className="mb-2 me-2">
            <Dropdown.Toggle size="sm" split variant="info">
              <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown dropdown-menu-left">
              <Dropdown.Item href="#action">Edit</Dropdown.Item>
              <Dropdown.Item as="button" className="text-danger">Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Name</th>
              <th className="border-0">Designation</th>
              <th className="border-0">Email</th>
              <th className="border-0">Phone</th>
              <th className="border-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(tm => <TableRow key={`team-member-${tm.id}`} {...tm} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};