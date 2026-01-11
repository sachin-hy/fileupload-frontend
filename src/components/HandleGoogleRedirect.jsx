
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

//http://localhost:31237
function HandleGoogleRedirect()
{

    const location = useLocation();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    
    const queryParams= new URLSearchParams(location.search); 
   
    const code = queryParams.get("code");
    const state = queryParams.get("state");
    const scope = queryParams.get("scope");
    const error = queryParams.get("error");
    const error_description = queryParams.get("error_description");
   
    useEffect(() => {
         
        if(error)
        {
            toast.error(error_description);
            navigate("/");
        }else{
            async  function processOAuthResponse() {
                setLoading(true);
                try{
                    const res = await axios.post("http://localhost:8081/oauth2/callback/google",{
                        code: code,
                        state: state,
                        scope: scope
                    });
   
                        
                        localStorage.setItem("token",res.data.token);
                       
                        localStorage.setItem("isLoggedIn","true");
                        toast.success("Login Successful!");
                        //redirect to home page
                        setLoading(false);
                        navigate("/");
                   

                }catch(err)
                { 
                    console.log("error  processOAuthResponse  = " , err);
                    toast.error("Something went wrong! Please Try Again After Some time");
                   setLoading(false);
                    navigate("/");
                }
        }      
        
        processOAuthResponse();
            
        }

        
    },[])
    return (
        <>
             <div className="flex items-center justify-center min-h-screen min-w-screen">
               {
                loading ? (
                    <ClipLoader color="#36d7b7" size={50} />
                ) : (
                    <></>
                )
               }
                
             </div>
        </>
    );
}

export default HandleGoogleRedirect;