import { createContext } from "react";
import Banner from "./Banner";
import ProfileHeader from "./ProfileHeader";
import SideBar_MainWindow from './SideBar_MainWindow'
import UserContext from "./UserContext";


function UserProfile({ Username = " User", U_type = "REgular" }) {

  const User = { Username, U_type }
  return (
    <>
      <UserContext.Provider value={User}>

        <SideBar_MainWindow />
      </UserContext.Provider>
    </>
  );
}
export default UserProfile;

