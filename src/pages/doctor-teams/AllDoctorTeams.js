import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@themesberg/react-bootstrap";

import { DoctorTeamTable } from "./DoctorTeamTable";

export default () => {
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <h4>All Doctor Teams</h4>
          <Button
            as={Link}
            variant="secondary"
            to="/doctor-teams/create"
            className="m-1"
          >
            Add New +
          </Button>
        </div>
      </div>

      <DoctorTeamTable />
    </>
  );
};
