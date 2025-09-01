import { useEffect, useState } from "react";

import UserMenu from "../UserMenu/UserMenu";
import type { User } from "../../types/user";

import "./Header.css";

export default function Header() {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_USER_INFO" }, (userInfo: User) => {
      setUserInfo(userInfo);
    });
  }, [])

  return (
    <div className="header">
      <div className="header-app-title">ResumAI</div>
      {userInfo && <UserMenu userInfo={userInfo} />}
    </div>
  )
}
