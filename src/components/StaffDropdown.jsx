import React, { useState, useRef, useEffect } from "react";
import "./StaffDropdown.css";

const StaffDropdown = ({ staffMembers, onAssign, currentStaffId }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredStaff = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentStaff = staffMembers.find(
    (staff) => staff.id === currentStaffId
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`assign ${isOpen ? "open" : "close"}`} ref={dropdownRef}>
      <button className="assign-btn" onClick={() => setIsOpen((prev) => !prev)}>
        {currentStaff ? `${currentStaff.name}` : ""}
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <ul className="staff-list">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <li
                  key={staff.id}
                  onClick={() => {
                    onAssign(staff.id);
                    setIsOpen(false);
                  }}
                  className="staff-list-item"
                >
                  {staff.name}
                </li>
              ))
            ) : (
              <li className="not-found-staff">Không tìm thấy</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StaffDropdown;
