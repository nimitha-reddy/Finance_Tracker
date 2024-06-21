import React, { useEffect } from 'react';
import './styles.css';
import { auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImg from '../../assests/user.svg'
function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate=useNavigate();
  useEffect(()=>{
    if(user){
      navigate("/dashboard")
    }
  },[user,loading])

  function logoutFnc(){
    try{
      signOut(auth).
      then(() => {
        toast.success("Logged Out Succesfully!");
        navigate("/");
      }).catch((error) => {
        toast.error(error.message);
      }); 
    }catch(e){
      toast.error(e.message);
    }

  }
  return (
    <div className="navbar">
      <p style={{color:"var(--white)",fontWeight:500,fontsize:"1.2rem",margin:"0"}}>Financly</p>
      {user && (
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          <img src={user.photoURL?(user.photoURL):(userImg)}  style={{borderRadius:"50%",height:"1.5rem", width:"1.5rem"}}></img>
      <p className="link" onClick={logoutFnc}>Logout</p>
      </div>
        )}
    </div>
  );
}

export default Header
