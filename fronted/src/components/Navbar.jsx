import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdAddHome, MdPermContactCalendar, MdAdminPanelSettings } from "react-icons/md";
import { MdHomeWork } from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";
import AddPropertyModal from "./AddPropertyModal";
import useAuthCheck from "../hooks/useAuthCheck";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = ({ containerStyles }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { isAuthenticated } = useAuth0();

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  };

  return (
    <nav className={`${containerStyles}`}>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          isActive
            ? "active-link flexCenter gap-x-1 rounded-full px-2 py-1"
            : "flexCenter gap-x-1 rounded-full px-2 py-1"
        }
      >
        <MdHomeWork />
        <div>Home</div>
      </NavLink>

      <NavLink
        to={"/listing"}
        className={({ isActive }) =>
          isActive
            ? "active-link flexCenter gap-x-1 rounded-full px-2 py-1"
            : "flexCenter gap-x-1 rounded-full px-2 py-1"
        }
      >
        <RiCheckboxMultipleBlankFill />
        <div>Listing</div>
      </NavLink>

      {isAuthenticated && (
        <NavLink
          to={"/admin"}
          className={({ isActive }) =>
            isActive
              ? "active-link flexCenter gap-x-1 rounded-full px-2 py-1"
              : "flexCenter gap-x-1 rounded-full px-2 py-1"
          }
        >
          <MdAdminPanelSettings />
          <div>Admin</div>
        </NavLink>
      )}

      <NavLink
        to={"mailto:inquiries.gondaliyaparth025@gmail.com"}
        className={"flexCenter gap-x-1 rounded-full px-2 py-1 cursor-pointer"}
      >
        <MdPermContactCalendar />
        <div>Contact</div>
      </NavLink>

      <div
        onClick={handleAddPropertyClick}
        className={"flexCenter gap-x-1 rounded-full px-2 py-1 cursor-pointer"}
      >
        <MdAddHome />
        <div>Add Property</div>
      </div>

      <AddPropertyModal 
        opened={modalOpened}
        setOpened={setModalOpened}
      />
    </nav>
  );
};

export default Navbar;
