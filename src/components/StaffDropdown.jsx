import React, { useState, useRef, useEffect } from "react";

const StaffDropdown = ({
  staffMembers,
  onAssign,
  currentStaffId,
  className,
}) => {
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
    <div className={`${className} ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-blue-500 text-white px-2 py-1 rounded"
      >
        {currentStaff ? `Assigned: ${currentStaff.name}` : "Assign Staff"}
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b"
          />
          <ul className="max-h-60 overflow-auto">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <li
                  key={staff.id}
                  onClick={() => {
                    onAssign(staff.id);
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {staff.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No staff members found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StaffDropdown;
