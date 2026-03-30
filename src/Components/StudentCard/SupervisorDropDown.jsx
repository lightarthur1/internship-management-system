import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./SupervisorDropDown.css";

const SupervisorDropdown = ({ supervisors, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = supervisors.find((s) => s.id === selectedId);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (supervisorId) => {
    onSelect(supervisorId);
    setOpen(false);
  };

  return (
    <div className="sup-dropdown" ref={ref}>
      <button
        className={`sup-dropdown-trigger ${open ? "sup-dropdown-trigger-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selected ? "sup-dropdown-selected" : "sup-dropdown-placeholder"}>
          {selected ? selected.name : "Select supervisor"}
        </span>
        <ChevronDown
          size={16}
          className={`sup-dropdown-chevron ${open ? "sup-dropdown-chevron-open" : ""}`}
        />
      </button>

      {open && (
        <div className="sup-dropdown-menu">
          {supervisors.map((supervisor) => {
            const isSelected = supervisor.id === selectedId;
            return (
              <button
                key={supervisor.id}
                className={`sup-dropdown-option ${isSelected ? "sup-dropdown-option-active" : ""}`}
                onClick={() => handleSelect(supervisor.id)}
              >
                <span>{supervisor.name}</span>
                {isSelected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SupervisorDropdown;