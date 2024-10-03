import React, { useState } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { CSVLink } from "react-csv";
import ModalAddProductItem from "../../components/ModalAddProductItem";
import Papa from "papaparse";  
import { toast } from "react-toastify";  

const AdminProduct = () => {
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [listStaffs, setListStaffs] = useState([]);  
  const [showModalAddProduct, setShowModalAddProduct] = useState(false); 

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const getProductExport = () => {
  };

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

  const handleOpenModal = () => setShowModalAddProduct(true);
  const handleCloseModal = () => setShowModalAddProduct(false);

  const handleSubmitProduct = (formData) => {
    console.log("New product data:", formData);
    toast.success("Product added successfully!");
    handleCloseModal();
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
                onChange={handleImportCSV}
              />
            </div>

            <CSVLink
              filename={"staff_export.csv"}
              className="btn btn-success"
              data={dataExport}
              asyncOnClick={true}
              onClick={getProductExport}
            >
              <i className="fa-solid fa-file-export px-1"></i>
              <span className="px-1">Export</span>
            </CSVLink>

            <button
              className="btn btn-primary"
              onClick={handleOpenModal} 
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

        <ModalAddProductItem
          isOpen={showModalAddProduct}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProduct}
        />
      </div>
    </>
  );
};

export default AdminProduct;
