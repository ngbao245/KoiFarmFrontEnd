import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import { CSVLink } from "react-csv";
import ModalAddProductItem from "../../components/ModalAddProductItem";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { fetchAllProdItem } from "../../services/ProductItemService";
import { getProductById } from "../../services/ProductService";
import FishSpinner from "../../components/FishSpinner";

const AdminProduct = () => {
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [listProductItems, setListProductItems] = useState([]);
  const [showModalAddProduct, setShowModalAddProduct] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isUploading, setIsUploading] = useState(false);

  const fetchProductItems = async (searchQuery = "") => {
    try {
      const response = await fetchAllProdItem(pageIndex, pageSize, searchQuery);
      if (response && response.data && response.data.entities) {
        const productItems = response.data.entities;

        const detailedProductItems = await Promise.all(
          productItems.map(async (item) => {
            const productResponse = await getProductById(item.productId);
            return {
              ...item,
              productName: productResponse?.data?.name || "Unknown",
            };
          })
        );

        setListProductItems(detailedProductItems);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error("Unexpected data format received");
      }
    } catch (error) {
      toast.error("Failed to fetch product items");
    }
  };

  useEffect(() => {
    fetchProductItems(searchTerm);
  }, [fetchAgain, pageIndex, pageSize, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPageIndex(1);
  };

  const getProductExport = () => {};

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

  const handleSubmitProduct = (newProduct) => {
    setFetchAgain((prev) => !prev);
    setIsUploading(false);
    handleCloseAddNew();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageIndex(newPage);
      console.log("Changing page to:", newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPageIndex(1);
  };

  const filteredProductItems = Array.isArray(listProductItems)
    ? listProductItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      )
    : [];

  return (
    <>
      <AdminHeader />

      <div className="container">
        {isUploading && <FishSpinner />}
        <div className="my-3 add-new d-sm-flex">
          <span>
            <b>Danh sách các mặt hàng sản phẩm:</b>
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
              filename={"xuat_san_pham.csv"}
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
              disabled={isUploading}
            >
              <i className="fa-solid fa-circle-plus px-1"></i>
              <span className="px-1">Thêm Mới</span>
            </button>
          </div>
        </div>

        <div className="col-12 col-sm-4 my-3">
          <input
            className="form-control"
            placeholder="Tìm kiếm mặt hàng sản phẩm theo tên..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="container-fluid">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Cá Koi</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Nguồn gốc</th>
              <th>Giới tính</th>
              <th>Tuổi</th>
              <th>Kích thước</th>
              <th>Loài</th>
              <th>Tính cách</th>
              <th>Lượng thức ăn</th>
              <th>Nhiệt độ nước</th>
              <th>Khoáng chất</th>
              <th>pH</th>
              <th>Số lượng</th>
              <th>Giống</th>
              <th>Loại cá</th>
              <th>Ảnh</th>
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
                  <td>{item.productName}</td>
                  <td>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="16">Không tìm thấy sản phẩm nào</td>
                </tr>
                <tr>
                  <td colSpan="16">
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
      </div>

      <div className="pagination-controls text-center user-select-none">
        <button
          className="btn btn-secondary"
          disabled={pageIndex === 1}
          onClick={() => handlePageChange(pageIndex - 1)}
        >
          Trước
        </button>
        <span className="px-3">
          Trang {pageIndex} / {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          disabled={pageIndex === totalPages}
          onClick={() => handlePageChange(pageIndex + 1)}
        >
          Sau
        </button>

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="ml-3"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <ModalAddProductItem
        isOpen={showModalAddProduct}
        onClose={handleCloseAddNew}
        onSubmit={handleSubmitProduct}
        setIsUploading={setIsUploading}
      />
    </>
  );
};

export default AdminProduct;
