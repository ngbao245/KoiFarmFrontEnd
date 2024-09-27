import React, { useState } from "react";
import { CSVLink } from "react-csv";
import ModalAddNew from "../../components/ModalAddNew";
import Papa from "papaparse"; // Assuming you're using papaparse for CSV import
import { toast } from "react-toastify";
import "./Admin.css"; // Make sure this file includes required styles

const Admin = () => {
  const [listStaffs, setListStaffs] = useState([]);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulating CSV import handling with PapaParse
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Only CSV files are accepted");
        return;
      }
      Papa.parse(file, {
        complete: (results) => {
          const csvData = results.data;
          const formattedData = csvData.slice(1).map((row) => ({
            email: row[0],
            name: row[1],
            position: row[2],
          }));
          setListStaffs(formattedData);
          toast.success("Import successful");
        },
      });
    }
  };

  // Export staff list to CSV
  const getUsersExport = () => {
    const exportData = listStaffs.map((staff) => ({
      Name: staff.name,
      Email: staff.email,
      Position: staff.position,
    }));
    setDataExport([
      ["Name", "Email", "Position"], // CSV headers
      ...exportData.map((staff) => [staff.Name, staff.Email, staff.Position]),
    ]);
  };

  const handleClose = () => {
    setIsShowModalAddNew(false);
  };

  const handleUpdateTable = (staff) => {
    setListStaffs([staff, ...listStaffs]);
  };

  // Searching staff members
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filtering staff based on the search term
  const filteredStaffs = listStaffs.filter((staff) =>
    staff.email.toLowerCase().includes(searchTerm)
  );

  return (
    <>
      <div className="container">
        <div className="my-3 add-new d-sm-flex">
          <span>
            <b>List Staffs:</b>
          </span>
          <div className="group-btns mt-sm-0 mt-2">
            <div>
              <label htmlFor="import" className="btn btn-dark">
                <i className="fa-solid fa-file-import px-1"></i>
                <span className="px-1">Import</span>
              </label>
              <input
                id="import"
                type="file"
                hidden
                onChange={(event) => handleImportCSV(event)}
              />
            </div>

            <CSVLink
              filename={"staff_export.csv"}
              className="btn btn-success"
              data={dataExport}
              asyncOnClick={true}
              onClick={getUsersExport}
            >
              <i className="fa-solid fa-file-export px-1"></i>
              <span className="px-1">Export</span>
            </CSVLink>

            <button
              className="btn btn-primary"
              onClick={() => setIsShowModalAddNew(true)}
            >
              <i className="fa-solid fa-circle-plus px-1"></i>
              <span className="px-1">Add new</span>
            </button>
          </div>
        </div>

        <div className="col-12 col-sm-4 my-3">
          <input
            className="form-control"
            placeholder="Search user by email..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Display filtered staff members */}
        <div className="staff-list">
          {filteredStaffs.length > 0 ? (
            filteredStaffs.map((staff, index) => (
              <div key={index} className="staff-item">
                {staff.name} - {staff.email} - {staff.position}
              </div>
            ))
          ) : (
            <div>No staff found</div>
          )}
        </div>

        <ModalAddNew
          show={isShowModalAddNew}
          handleClose={handleClose}
          handleUpdateTable={handleUpdateTable}
        />
      </div>
    </>
  );
};

export default Admin;
