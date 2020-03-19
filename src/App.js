import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    IsSignedIn: false,
    name:'',
    email:'',
    photo:''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
      firebase.auth().signInWithPopup(provider)
      .then(res =>{
        const {displayName, photoURL, email} = res.user;
        const signedInUser = {
          IsSignedIn: true,
          name:displayName,
          email:email,
          photo:photoURL
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then( res =>{
      const signedOutUser = {
        IsSignedIn: false,
        name:'',
        photo:'',
        email:'',
        password:'',
        error:'',
        isValid:false,
        existingUser:false
      }
      setUser(signedOutUser);
      console.log(res);
    })
    .catch( err => {
    })
  }

  const is_valid_email = email => ( /(.+)@(.+){2,}\.(.+){2,}/.test(email) )
  const hasNumber = input => /\d/.test(input);

  const switchForm = e =>{
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
    console.log(e.target.checked)

  }
  const handleChange = e =>{
    const newUserInfo = {...user};
    //debugger
    // perform validation
    let isValid = true;
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    } 
    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if(user.isValid){
    //console.log(user.email, user.password);
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res =>{
      console.log(res);
      const createdUser = {...user};
      createdUser.IsSignedIn = true;
      createdUser.error = '';
      setUser(createdUser);
    }) 
    .catch(err =>{
       console.log(err.message);
       const createdUser = {...user};
       createdUser.IsSignedIn = false;
       createdUser.error = err.message;
       setUser(createdUser);
    })
    }

   event.preventDefault();
   event.target.reset();
  }

  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res);
        const createdUser = {...user};
        createdUser.IsSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      }) 
      .catch(err =>{
         console.log(err.message);
         const createdUser = {...user};
         createdUser.IsSignedIn = false;
         createdUser.error = err.message;
         setUser(createdUser);
      })
      }

    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
      { 
        user.IsSignedIn ? <button onClick = {handleSignOut}>Sign Out</button> :
        <button onClick = {handleSignIn}>Sign in</button> 
      }
      {
        user.IsSignedIn && <div>
          <p>Welcome,{user.name}</p>
      <p>Your email id:{user.email}</p>
      <img src={user.photo} alt=""/>
        </div>  
      }
      <h1>Our Own Authentication</h1>
      <input type="checkbox" name="switchForm" id="switchForm" onChange={switchForm}/>
      <label htmlFor="switchForm">Returning user</label>
      <form style={{display:user.existingUser ? 'block':'none'}} onSubmit={signInUser}>
      <input type="text" onBlur={handleChange} name="email" placeholder="Enter Email" required/>
      <br/><br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Enter Password" required/>
      <br/><br/>
      <input type="submit" value="signIn"/>
      </form>
      <br/>
      <form style={{display:user.existingUser ? 'none':'block'}} onSubmit={createAccount}>
      <input type="text" onBlur={handleChange} name="name" placeholder="Enter Name" required/>
      <br/><br/>
      <input type="text" onBlur={handleChange} name="email" placeholder="Enter Email" required/>
      <br/><br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Enter Password" required/>
      <br/><br/>
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>

  );
}

export default App;
