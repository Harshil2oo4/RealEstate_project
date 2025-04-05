import React from "react";
import { Avatar, Menu } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { MdPerson, MdFavorite, MdEventNote, MdExitToApp } from "react-icons/md";

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();
  const savedImage = localStorage.getItem(`user_image_${user?.email}`);

  return (
    <Menu>
      <Menu.Target>
        <Avatar 
          src={savedImage || user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email)}&background=random`} 
          alt="userImage" 
          radius="xl"
          imageProps={{
            onError: (e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email)}&background=random`;
            }
          }}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item 
          icon={<MdPerson size={14} />}
          onClick={() => navigate("/profile", { replace: true })}
        >
          Profile
        </Menu.Item>
        <Menu.Item 
          icon={<MdFavorite size={14} />}
          onClick={() => navigate("/favourites", { replace: true })}
        >
          Favourites
        </Menu.Item>
        <Menu.Item 
          icon={<MdEventNote size={14} />}
          onClick={() => navigate("/bookings", { replace: true })}
        >
          Bookings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          icon={<MdExitToApp size={14} />}
          onClick={() => {
            localStorage.clear();
            logout();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu; 