import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import ModalAddNew from "../../components/ModalAddNew";
import Papa from "papaparse";
import { toast } from "react-toastify";
import "./Admin.css";
import AdminHeader from "../../layouts/header/AdminHeader";
import { fetchAllStaff } from "../../services/UserService";

const Admin = () => {
  const [listStaffs, setListStaffs] = useState([]);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetchAllStaff();
        if (response && response.data) {
          setListStaffs(response.data);
        } else {
          toast.error("Unexpected data format received");
        }
      } catch (error) {
        toast.error("Failed to fetch staff members");
      }
    };
    fetchStaff();
  }, [fetchAgain]);

  // Handle CSV import
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

  const getUsersExport = () => {
    const exportData = listStaffs.map((staff) => ({
      Name: staff.name,
      Email: staff.email,
      Address: staff.address,
      Phone: staff.phone,
      RoleId: staff.roleId,
    }));
    setDataExport([
      ["Name", "Email", "Address", "Phone", "Role ID"],
      ...exportData.map((staff) => [
        staff.Name,
        staff.Email,
        staff.Address,
        staff.Phone,
        staff.RoleId,
      ]),
    ]);
  };

  const handleClose = () => {
    setIsShowModalAddNew(false);
  };

  const handleUpdateTable = (staff) => {
    setFetchAgain((prev) => !prev); // Toggle fetchAgain to refetch staff data
    setIsShowModalAddNew(false); // Close the modal after adding
  };

  // Search functionality
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredStaffs = Array.isArray(listStaffs)
    ? listStaffs.filter((staff) =>
        staff.email.toLowerCase().includes(searchTerm)
      )
    : [];

  return (
    <>
      <AdminHeader />
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

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Role ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.length > 0 ? (
              filteredStaffs.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.address}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.roleId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No staff found</td>
              </tr>
            )}
          </tbody>
        </table>

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
