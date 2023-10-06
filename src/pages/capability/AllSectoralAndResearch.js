
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Button } from '@themesberg/react-bootstrap';

import { SectoralResarchTable } from "./SectoralResarchTable";


export default () => {
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <h4>All Sectoral and Research</h4>
          <Button variant="secondary" className="m-1">Add New +</Button>
        </div>
      </div>

      <SectoralResarchTable />
    </>
  );
};
