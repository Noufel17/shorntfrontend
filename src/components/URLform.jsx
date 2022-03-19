import React from "react";
import { useState, useEffect } from "react";
import validator from "validator";
import axios from "axios";
import {useNavigate, useParams } from "react-router-dom";

function URLform() {
  //state hooks
  const [url, seturl] = useState("");
  const [links, setlinks] = useState([]);
  const [invalidString, setinvalidString] = useState('');
  const [server] = useState('https://arcane-springs-69826.herokuapp.com/');
  const { username } = useParams();
 
  const navigate=useNavigate();
  // need to do it one time i used usEffect 
  // get all URLs already in database
  useEffect(() => {
    axios
      .get(server + "API/getData/" + username) // we have to send username here to filter by it
      .then((res) => {
        console.log(res.data);
        const userURLs = res.data;
        setlinks(userURLs);
      })
      .catch((reason) => {
        console.error(reason);
      });
  }, [server,username]);

  // still need to emplement a button to delete every link in shown list
  // and a function handle delete
  // add a signed as username in homepage header top right to see which user is signed in
  //event handlers
  const handleChange = (e) => {
    e.preventDefault();
    const elem=document.getElementById('invalid');
      elem.classList.add('hidden');
    seturl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validURL = validator.isURL(url, { require_protocol: true });
    if (!validURL) {
      setinvalidString('please enter a valid url with http(s) protocol');
      const elem=document.getElementById('invalid');
      elem.classList.remove('hidden');
    } else {
      console.log("url is : " + url);
      axios
        .post(server+"API/shorten", {
          url: url,
          username: username,
        }) // we have to post username too here
        .then((res) => {
          console.log("status: " + res.data.status);
          console.log("hash code: " + res.data.doc.hash);
          if (res.data.status === 200) {
            // new link
            setlinks([...links, res.data.doc]);
          }
          else if(res.data.status === 300){
            setinvalidString("you have already shortened this URL");
            const elem=document.getElementById("invalid");
            elem.classList.remove('hidden');
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  };
  const handleDelete=((e,link)=>{
    e.preventDefault();
    axios.post(server + "API/deletion", // delete request is not allowed
    {URL:link.URL,hash:link.hash,username:link.urlOwner})
    .then(res=>{
      console.log(res.data);
      if(res.data.doc && res.data.status===200 && res.data.statustxt==='deleted'){
        // remove link from links state
        setlinks(links.filter((item)=>{
          return item.hash !== link.hash
        }))
      }else if(res.data.status===300 && res.data.statustxt==='not found'){
        console.log('element to delete not found in database');
      }
    })
    .catch(err=>{
      console.error(err);
    })
  })
  const signout=((e)=>{
    e.preventDefault();
    navigate("/Signin");
  })

  return (
    <div className=" px-4 sm:px-20">
      <header className="w-full flex flex-col sm:flex-row sm:justify-between items-center ">
          <img src="/img/logo.png" width={250} height={250} alt="logo" />
          <div className="py-4 flex justify-evenly sm:block ">
          <p className="text-left sm:text-center mr-6 sm:inline-block
            text-black-500 text-sm sm:text-xl  font-bold">signed in as <span className="text-left  py-4
            text-black-700 text-sm sm:text-xl font-bold"> {username}</span></p>
          <button className="flex-shrink-0 bg-white hover:bg-gray-700 inline-block
                 border-gray-900 border-2 text-gray-900 hover:border-gray-600 text-sm
                  hover:text-white py-1 px-2 rounded" onClick={signout}>
                    signout
          </button>
          </div>
        </header>
        <div className="grid grid-cols-1 grid-row-2 grid-flow-row gap-4 ">
        <form
          className="bg-white shadow-md rounded px-4 pt-3 pb-4 
           sm:px-8 sm:pt-6 sm:pb-8 h-fit w-full sm:w-2/3 mx-auto "
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center border-b border-teal-500 py-2 ">
            <label
              htmlFor="urlInput"
              className="flex-shrink-0 mr-4 content-center text-gray-700 text-sm font-bold"
            >
              URL :{" "}
            </label>
            <input
              id="urlInput"
              type="text"
              autoFocus
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3
               py-1 px-2 leading-tight focus:outline-none  "
              placeholder="enter a valid URL with the protocol included (http)"
              onChange={handleChange}
            ></input>
            <button
              type="submit"
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 
              border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              shorten
            </button>
          </div>
          <p id="invalid" className="text-red-500 hidden mt-2">
            {invalidString}
          </p>
        </form>
        <table
          className=" shadow-lg bg-white border-separate table-fixed w-full sm:w-11/12 mx-auto"
        >
          <thead>
            <tr className="text-sm sm:text-xl mx-auto my-auto" >
              <th className="bg-teal-400 rounded-tl-2xl sm:px-8 sm:py-4
               font-bold text-white">URL</th>
              <th className="bg-teal-400 sm:px-8 sm:py-4
               font-bold text-white">Shortened</th>
              <th className="bg-teal-400 font-bold sm:px-8 sm:py-4
              text-white rounded-tr-2xl sm:w-44"> Delete</th>
            </tr>
          </thead>
          {links.map((link) => {
            return (
              <tbody key={link._id}>
                <tr>
                  <td className="border px-1 py-0.5 text-xs sm:text-xl sm:px-8 sm:py-4 hover:bg-gray-100">
                    <p className="break-words mx-auto">{link.URL}</p>
                  </td>
                  <td className="border px-1 py-0.5 text-xs sm:text-xl sm:px-8 sm:py-4 hover:bg-gray-100">
                    <a className="hover:text-teal-500 hover:underline break-words mx-auto" href={server + link.hash}>
                    {server + link.hash}</a>
                  </td>
                  <td className="border px-1 py-0.5 sm:px-8 sm:py-4 hover:bg-gray-100">
                    <button className="flex-shrink-0 flex bg-red-500 hover:bg-red-700
                    border-red-500 hover:border-red-700 text-sm border-4 mx-auto my-auto
                      text-white py-1 px-2 rounded" onClick={(e)=>handleDelete(e,link)}>
                       Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
    </div>
    </div> 
  );
}
export default URLform;
