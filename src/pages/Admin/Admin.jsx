import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import ModalAddNew from "../../components/ModalAddNew";
import Papa from "papaparse";
import { toast } from "react-toastify";
import "./Admin.css";
import AdminHeader from "../../layouts/header/AdminHeader";
import { fetchAllStaff } from "../../services/UserService";
import ModalConfirm from "../../components/ModalConfirm";
import HintBox from "../../components/HintBox";

const Admin = () => {
  const [listStaffs, setListStaffs] = useState([]);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [dataStaffDelete, setDataStaffDelete] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetchAllStaff();
        if (response && response.data) {
          setListStaffs(response.data.entities);
        } else {
          toast.error("Unexpected data format received");
        }
      } catch (error) {
        toast.error("Failed to fetch staff members");
      }
    };
    fetchStaff();
  }, [fetchAgain]);

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

  const getStaffsExport = () => {
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

  const handleCloseAddNew = () => {
    setIsShowModalAddNew(false);
  };

  const handleUpdateTable = (staff) => {
    setFetchAgain((prev) => !prev); // Toggle fetchAgain to refetch staff data
    setIsShowModalAddNew(false); // Close the modal after adding
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredStaffs = Array.isArray(listStaffs)
    ? listStaffs.filter((staff) =>
        staff.email.toLowerCase().includes(searchTerm)
      )
    : [];

  const handleDelete = (staff) => {
    setDataStaffDelete(staff);
    setIsShowModalConfirm(true);
  };

  const handleDeleteStaffFromModal = (deletedStaff) => {
    setListStaffs(listStaffs.filter((staff) => staff.id !== deletedStaff.id));
  };

  const handleCloseConfirm = () => {
    setIsShowModalConfirm(false);
  };

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
              onClick={getStaffsExport}
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
            placeholder="Search staff by email..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <HintBox />

        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Role ID</th>
              <th>Delete</th>
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
                  <td>
                    <button
                      className="btn btn-danger mx-3"
                      onClick={() => handleDelete(staff)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="6">No staff found</td>
                </tr>
                <tr>
                  <td colSpan="6">
                    <i
                      className="fa-regular fa-folder-open"
                      style={{ fontSize: "30px", opacity: 0.2 }}
                    ></i>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <ModalAddNew
          show={isShowModalAddNew}
          handleClose={handleCloseAddNew}
          handleUpdateTable={handleUpdateTable}
        />

        <ModalConfirm
          show={isShowModalConfirm}
          handleClose={handleCloseConfirm}
          dataStaffDelete={dataStaffDelete}
          handleDeleteStaffFromModal={handleDeleteStaffFromModal}
        />
      </div>
    </>
  );
};

export default Admin;
