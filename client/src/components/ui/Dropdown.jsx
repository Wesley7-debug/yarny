import { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, options = [] }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleOptionClick = (opt, idx, e) => {
    e.stopPropagation();

    if (opt.customRender) {
      return;
    }

    opt.onClick?.();
    setOpen(false);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Element */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-2 z-10 mt-2 min-w-[180px] rounded-md bg-white shadow-lg ring-1 ring-white/35 ring-opacity-5 text-sm">
          <ul>
            {options.map((opt, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-white/10 cursor-pointer mb-2"
                onClick={(e) => handleOptionClick(opt, idx, e)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
