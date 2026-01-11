import axios from "axios";
import { toast } from "react-toastify";
import { BASEURL } from "./BASEURL";
import React from "react";

export const SignUpApiCall = async (firstName, lastName, email, password, navigate) => {


    try{
        const response = await axios.post(`${BASEURL}/signup`, {
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password
        });

     
       toast.success("Sign Up Successful. Please log in.");
      
        navigate('/login');
    }catch(e)
    {
        toast.error( e?.response?.data);
        console.log(e);
    }

}