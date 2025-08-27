import { useEffect, useState } from "react";

import type { User } from "../../types/user";

export default function TailorResumesPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_USER_INFO" }, (userInfo: User) => {
      setUserInfo(userInfo);
    });
  }, [])

  return (
    <div>
      Welcome {userInfo?.firstName}!
    </div>
  )
}
