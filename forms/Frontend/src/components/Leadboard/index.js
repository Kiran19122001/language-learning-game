import {useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Leadboard=()=>{
    const [userData, setUserData] = useState(null);
    const navigate=useNavigate()
      useEffect(() => {
        getData();
      }, []);
    
      const getData = async () => {
        try {
          // Retrieve the JWT token from localStorage
          const token = localStorage.getItem("token");
    
          if (token) {
            // Attach the token to the Authorization header
            const headers = {
              Authorization: `Bearer ${token}`,
            };
    
            // Make a GET request to get user details
            const response = await Axios.get("http://localhost:1000/api/user", { headers });
            console.log("User Data Response:", response.data);
            // Set the user data in the state
            setUserData(response.data.user);
          } else {
            console.error("Token not found");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
    return(
        <div>
            <h1>Leadboard</h1>
            {userData && (
        <div>
            <p>Name : {userData.name}</p>
        </div>
      )}
        </div>
    )
}
export default Leadboard