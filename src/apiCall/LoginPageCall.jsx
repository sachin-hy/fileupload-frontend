
import { toast } from "react-toastify";
import axios from 'axios';
import { BASEURL } from "./BASEURL";




export const loginApi = async (email, password,login,navigate) =>
{
     
   
    try{
        const response = await axios.post(`${BASEURL}/login`,{
            email : email,
            password : password
        });
      
        login(response?.data?.token);
    

       toast.success("Login Successful");
     
       navigate('/');
     

    }catch(e)
    {
        console.log(e);
        toast.error( e?.response?.data?.message);
    
    }

}