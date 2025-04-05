import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "./ProfileMenu";
import { MdHomeWork, MdAddHome, MdPermContactCalendar, MdAdminPanelSettings } from "react-icons/md";
import { RiCheckboxMultipleBlankFill } from "react-icons/ri";
import AddPropertyModal from "./AddPropertyModal";
import useAuthCheck from "../hooks/useAuthCheck";

const Header = () => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const [modalOpened, setModalOpened] = useState(false);
  const { validateLogin } = useAuthCheck();

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  };

  return (
    <header className="max-padd-container fixed top-1 w-full left-0 right-0 z-50">
      <div className="max-padd-container bg-white transition-all duration-200 rounded-full px-5 ring-1 ring-slate-900/5">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="w-[200px]">
            <span className="font-[900] text-[24px]">
              Lotus <span className="font-[600] medium-20">Nest</span>
            </span>
          </Link>

          {/* Navigation - Centered */}
          <div className="flex-1 flex justify-center gap-x-5">
            <Link to="/" className="flexCenter gap-x-1 rounded-full px-2 py-1 hover:text-secondary">
              <MdHomeWork />
              <div>Home</div>
            </Link>

            <Link to="/listing" className="flexCenter gap-x-1 rounded-full px-2 py-1 hover:text-secondary">
              <RiCheckboxMultipleBlankFill />
              <div>Listing</div>
            </Link>

            {isAuthenticated && (
              <Link to="/admin" className="flexCenter gap-x-1 rounded-full px-2 py-1 hover:text-secondary">
                <MdAdminPanelSettings />
                <div>Admin</div>
              </Link>
            )}

            <Link to="mailto:inquiries.gondaliyaparth025@gmail.com" className="flexCenter gap-x-1 rounded-full px-2 py-1 hover:text-secondary">
              <MdPermContactCalendar />
              <div>Contact</div>
            </Link>

            <div
              onClick={handleAddPropertyClick}
              className="flexCenter gap-x-1 rounded-full px-2 py-1 hover:text-secondary cursor-pointer"
            >
              <MdAddHome />
              <div>Add Property</div>
            </div>
          </div>

          {/* Auth - Fixed width to match logo */}
          <div className="w-[200px] flex justify-end">
            {!isAuthenticated ? (
              <button
                onClick={loginWithRedirect}
                className="btn-secondary flexCenter gap-x-2 medium-16 rounded-full"
              >
                Login
              </button>
            ) : (
              <ProfileMenu user={user} logout={logout} />
            )}
          </div>
        </div>
      </div>

      <AddPropertyModal 
        opened={modalOpened}
        setOpened={setModalOpened}
      />
    </header>
  );
};

export default Header;
