import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { CSVLink } from "react-csv";
import ModalAddProductItem from "../../components/ModalAddProductItem";
import Papa from "papaparse";  
import { toast } from "react-toastify";
import { fetchAllProdItem } from "../../services/ProductItemService";  
import '../Admin/Admin.css';

const AdminProduct = () => {
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [listProductItems, setListProductItems] = useState([]);  
  const [showModalAddProduct, setShowModalAddProduct] = useState(false); 
  const [fetchAgain, setFetchAgain] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProductItems = async (searchQuery = "") => {
    try {
      const response = await fetchAllProdItem(pageIndex, pageSize, searchQuery);
      if (response && response.data && response.data.entities) {
        setListProductItems(response.data.entities); // Extract product items from entities
        setTotalPages(response.data.totalPages); // Set total pages for pagination
      } else {
        toast.error("Unexpected data format received");
      }
    } catch (error) {
      toast.error("Failed to fetch product items");
    }
  };

  useEffect(() => {
    fetchProductItems(searchTerm); // Fetch products when the component mounts or when fetchAgain changes
  }, [fetchAgain, pageIndex, pageSize, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPageIndex(1); // Reset to first page when searching
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
            name: row[0],
            price: row[1],
            category: row[2],
            sex: row[3],
            age: row[4],
            size: row[5],
            quantity: row[6],
            type: row[7],
          }));
          setListProductItems(formattedData);
          toast.success("Import successful");
        },
      });
    }
  };

  const handleCloseAddNew = () => {
    setShowModalAddProduct(false);
  };

  // Handle adding a new product item
  const handleSubmitProduct = (newProduct) => {
    setFetchAgain((prev) => !prev); // Trigger re-fetch to update the product list
    handleCloseAddNew(); // Close the modal
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageIndex(newPage); // Update page index for pagination
    }
  };

  // Filtered list based on search term
  const filteredProductItems = Array.isArray(listProductItems)
    ? listProductItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      )
    : [];

  return (
    <>
      <AdminHeader />
      <div className="container">
        <div className="my-3 add-new d-sm-flex">
          <span>
            <b>List Product Items:</b>
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
              onClick={() => setShowModalAddProduct(true)}
            >
              <i className="fa-solid fa-circle-plus px-1"></i>
              <span className="px-1">Add new</span>
            </button>
          </div>
        </div>

        <div className="col-12 col-sm-4 my-3">
          <input
            className="form-control"
            placeholder="Search product item by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* <div className="customize-table">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sex</th>
                <th>Age</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductItems.length > 0 ? (
                filteredProductItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.category}</td>
                    <td>{item.sex}</td>
                    <td>{item.age}</td>
                    <td>{item.size}</td>
                    <td>{item.quantity}</td>
                    <td>{item.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No product items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */}

        <div className="customize-table">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Origin</th>
                <th>Sex</th>
                <th>Age</th>
                <th>Size</th>
                <th>Species</th>
                <th>Personality</th>
                <th>FoodAmount</th>
                <th>WaterTemp</th>
                <th>MineralContent</th>
                <th>pH</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>ProductId</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductItems.length > 0 ? (
                filteredProductItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.category}</td>
                    <td>{item.origin}</td>
                    <td>{item.sex}</td>
                    <td>{item.age}</td>
                    <td>{item.size}</td>
                    <td>{item.species}</td>
                    <td>{item.personality}</td>
                    <td>{item.foodAmount}</td>
                    <td>{item.waterTemp}</td>
                    <td>{item.mineralContent}</td>
                    <td>{item.ph}</td>
                    <td>{item.quantity}</td>
                    <td>{item.type}</td>
                    <td>{item.productId}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16">No product items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-controls">
          <button 
            className="btn btn-secondary" 
            disabled={pageIndex === 1} 
            onClick={() => handlePageChange(pageIndex - 1)}
          >
            Previous
          </button>
          <span className="px-3">Page {pageIndex} of {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            disabled={pageIndex === totalPages} 
            onClick={() => handlePageChange(pageIndex + 1)}
          >
            Next
          </button>
        </div>

        <ModalAddProductItem
          isOpen={showModalAddProduct}
          onClose={handleCloseAddNew}
          onSubmit={handleSubmitProduct}
        />
      </div>
    </>
  );
};

export default AdminProduct;
