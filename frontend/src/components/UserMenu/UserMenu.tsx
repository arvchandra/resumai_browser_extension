import { useRef, useState } from "react";

import type { User } from "../../types/user";

import "./UserMenu.css";
import logoutIcon from "../../assets/images/logout-icon.png";

type UserMenuProps = {
  userInfo: User;
}

export default function UserMenu({ userInfo }: UserMenuProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    // Logout (clears Chrome local storage, removing all stored tokens and user info)
    chrome.runtime.sendMessage({ type: "LOGOUT" }, () => {
      console.log("logged out");
      setMenuOpen(false);
      window.close();
    });
  }

  function handleClickOutsideMenu(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    }
  };

  function handleUserIconClick() {
    setMenuOpen(!menuOpen);
    document.addEventListener('mousedown', handleClickOutsideMenu);
  }

  if (!userInfo) {
    return null;
  }

  const userInitials = userInfo.firstName[0] + (userInfo.lastName ? userInfo.lastName[0] : '');

  return (
    <div className="user-icon-menu-container" ref={menuRef}>
      <div className="user-icon" onClick={handleUserIconClick}>
        {userInitials}
      </div>
      {menuOpen && (
        <div className="user-dropdown-menu">
          <div className="user-info-container">
            <div className="user-icon">
              {userInitials}
            </div>
            <div className="user-name-email-container">
              <div><strong>{`${userInfo.firstName} ${userInfo.lastName}`}</strong></div>
              <div>{userInfo.email}</div>
            </div>
          </div>
          <div className="menu-item" onClick={handleLogout}>
            <img className="icon menu-icon" src={logoutIcon} alt="logout" />Logout
          </div>
        </div>
      )
      }
    </div >
  )
}
