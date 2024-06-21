import React, { useState } from 'react'
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider
 } from "firebase/auth";
import {doc, getDoc, setDoc } from "firebase/firestore";
import {auth,db,provider} from "../../firebase"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [loginForm,setLoginForm]=useState(false)
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("Password", password);
    console.log("Confirm Password", confirmPassword);
     //AUthenticate the user
     if(name!=""&& email!=""&& password!=""&&confirmPassword!=""){
      if(password==confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("User>>>",user);
    toast.success("User Created!");
    setLoading(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    createDoc(user);
    navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    setLoading(false);
    // ..
  });
      }else{
        toast.error("Password and Confirm Password don't match")
        setLoading(false);
      }
      
     }
     else{
      toast.error("All fields are mandatory!")
      setLoading(false);
     }
     
  }
  function loginUsingEmail(){
    if( email!="" && password!=""){
    console.log("Email",email);
    console.log("password",password)
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged In!");
    console.log("User Logged in",user);
    setLoading(false);
    navigate("/dashboard");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setLoading(false);
    toast.error(errorMessage);
  });
  }
  else{
    toast.error("All fields are mandatory!")
    setLoading(false);
  }
}

 async function createDoc(user){
  setLoading(true);
    //create a doc if the doc with  uid doesn't exist
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      const createdAt = new Date();
    try {
      await setDoc(doc( db,"users",user.uid), {
        name: user.displayName ? user.displayName : name,
        email:user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt,
      });  
      setLoading(false);
  }
  catch (error) {
    toast.error(error.message);
    console.error("Error creating user document: ", error);
    setLoading(false);
  }
}
else{
  toast.error("Doc already exits")
  setLoading(false);
}
}
 
function googleAuth(){
  try{
    setLoading(true);
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log('user>>>',user); 
    createDoc(user)
    toast.success("User authenticated"); 
    setLoading(false); 
    navigate("/dashboard");
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false);
  });
  }
  catch(e){
    toast.error(e.message);
    setLoading(false);
  }
}



  return(
      <>
      {loginForm?(
      <div className='signup-wrapper'>
    <h2 className='title'>Login on <span style={{color:"var(--theme)"}}>Financly</span></h2>
  <form>
    <Input 
    type="Email"
    label={"Email"} 
    state={email} 
    setState={setEmail} 
    placeholder={"Mikedoe@gmail.com"} 
    />
    <Input 
    type="password"
    label={"Password"} 
    state={password} 
    setState={setPassword} 
    placeholder={"Example@123"} 
    />
  <Button 
  disabled={loading}
  text={    loading? "Loading...": 'Log in Using Email and Password'} onClick={loginUsingEmail} 
  />
  <p style={{textAlign:"center"}} >or</p>
  <Button 
  onClick={googleAuth}
  text={loading? "Loading...":'Log in Using Google'} 
  blue={true}
  />
  <p 
    style={{cursor:"pointer",textAlign:"center",fontSize:"0.8rem",fontWeight:"300"}}
  onClick={()=>setLoginForm(!loginForm)}
 >
    or Don't have an account? Click Here
    </p>
    </form>
  </div>)
  :
  (
  <div className='signup-wrapper'>
    <h2 className='title'>Sign Up on <span style={{color:"var(--theme)"}}>Financly</span></h2>
  <form>
    <Input 
    label={"Full Name"} 
    state={name} 
    setState={setName} 
    placeholder={"Mike Doe"} 
    />
    <Input 
    type="Email"
    label={"Email"} 
    state={email} 
    setState={setEmail} 
    placeholder={"Mikedoe@gmail.com"} 
    />
    <Input 
    type="password"
    label={"Password"} 
    state={password} 
    setState={setPassword} 
    placeholder={"Example@123"} 
    />
    <Input 
    type="password"
    label={"Confirm Password"} 
    state={confirmPassword} 
    setState={setConfirmPassword} 
    placeholder={"Example@123"} 
    />
  <Button 
  disabled={loading}
  text={    loading? "Loading...": 'Signup Using Email and Password'} onClick={signupWithEmail} />
  <p 
  style={{textAlign:"center"}} >
    or</p>
  <Button 
   onClick={googleAuth}
  text={loading? "Loading...":'Signup Using Google'} 
  blue={true}/>
  <p 
   style={{cursor:"pointer",textAlign:"center",fontSize:"0.8rem",fontWeight:"300"}}
   onClick={()=>setLoginForm(!loginForm)}
    >
    or  Have an account already? Click  Here
    </p>
  </form>
  </div>
  )
}
  </>
  ) 
}
export default SignupSigninComponent;
