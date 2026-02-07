import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import UploadFile from "./components/UploadFile";
import DownloadFile from "./components/DownloadFile";
import LoginPage from "./components/LoginPage";
import HandleGoogleRedirect from "./components/HandleGoogleRedirect";
import { useLocation } from "react-router-dom";
import { Authprovider } from "./context/AuthContext";
import Feature from "./components/Feature";
import SignUpPage from "./components/SignUpPage";

function App() {
  const location = useLocation();

  return (
    <Authprovider>
      <div className="min-h-screen min-w-screen">
        {location.pathname !== "/login" && (
          <div className="h-[20%] w-full m-0 p-0">
            <Header />
          </div>
        )}

        <div className="h-[80%] w-full m-0 p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadFile />} />
            <Route path="/:s3Key" element={<DownloadFile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/google" element={<HandleGoogleRedirect />} />
            <Route path="/features" element={<Feature />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </Authprovider>
  );
}

export default App;
