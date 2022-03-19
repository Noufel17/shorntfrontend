import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
    // define route to sign in page after sign up
    const navigate=useNavigate();
    //define states
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const apiURL='https://arcane-springs-69826.herokuapp.com/';

    const getUsername=((event)=>{
        event.preventDefault();
        setusername(event.target.value);
    })
    const getPassword=((event)=>{
        event.preventDefault();
        setpassword(event.target.value);
    })
    const submitUser=(event)=>{
        event.preventDefault();
        axios.post(apiURL+'/API/signup',{username:username,password:password})
            .then(res=>{
                console.log(res.data);
                if(res.data.account && res.data.status===200 && res.data.statustxt==='saved'){
                    console.log('user saved');
                    // redirect user to sign in or homepage
                    navigate("/Signin");
                }else if(res.data.status===300 && res.data.statustxt==='invalid'){
                    console.log('invalid username or password');
                }
            })
            .catch(err=>{
                console.error(err);
            })
    }
  return (
<div className="block xl:grid xl:grid-cols-2 h-screen xl:justify-center content-center">
    <div className=" flex flex-wrap justify-center items-center flex-col max-w-full h-screen my-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-10/12  sm:w-7/12 lg:w-1/3 xl:w-1/2" onSubmit={submitUser}>
            <h1 className='text-black-700 text-lg sm:text-xl font-bold mr-5 text-center'>sign up</h1>
            <div className="mb-4">
                <label htmlFor="username"  className="block text-gray-700 text-sm font-bold mb-2">
                    username
                </label>
                <input type="text" placeholder='username' className="shadow appearance-none border rounded w-full py-3 px-3
                    text-gray-700 leading-tight focus:outline-none focus:border-teal-500
                    focus:shadow-outline"
                  onChange={getUsername} />
                  
            </div>
            <div className="mb-10">
            <label htmlFor="password" className="block text-gray-700 text-xs sm:text-sm font-bold mb-2">
                    password
                </label>
                <input type="password" placeholder='password' className="shadow appearance-none border
                    rounded w-full py-3 px-3 text-gray-700 leading-tight 
                    focus:outline-none focus:border-teal-500"
                onChange={getPassword}/>
            </div>
            <div className="flex justify-between mb-5 items-center">
                <button type='submit' className=" py-1 px-0.5 sm:py-2 sm:px-3 rounded bg-teal-500 hover:bg-teal-700 
                    border-teal-500 hover:border-teal-700 text-xs sm:text-sm border-4 text-white">
                    sign up
                </button>
                <p className='text-xs sm:text-sm'>have an account? <Link to={"/Signin"}
                className="hover:text-teal-500 hover:underline text-xs sm:text-sm">sign in</Link> </p>
            </div>
        </form>
    </div>
    <div className=" hidden xl:flex xl:flex-col bg-teal-500">
            <img src="/img/logow.png" className='my-auto mx-auto' alt="logo" />
    </div>
</div>
    
  )
}

export default Signup