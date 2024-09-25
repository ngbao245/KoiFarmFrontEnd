import { useState } from "react";
import { fetchAllUser } from "../../services/UserService";
import { useEffect } from "react";

const Admin = () => {
  const { user, setUser } = useState([]);
  const getUser = async () => {
    let res = await fetchAllUser();
    console.log(res);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <h1>Admin page</h1>
    </>
  );
};
export default Admin;
