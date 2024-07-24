import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const SignUp = () => {

  const navigate=useNavigate()

  const [name,setName]=useState('')  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassord] = useState('')
  const [profile,setProfile]=useState('')
  const [errorMsg,setErrorMsg]=useState(null)

  const handleSubmit=async(e)=>{
    console.log("entered signup")
    e.preventDefault()
    if(password!==confirmPassword)
    {
      setErrorMsg("password and confirm password must be same")
      return;
    }
    try{

        let imgUrl=""
        if(profile){
        const data = new FormData();
        data.append("file", profile);
        data.append("upload_preset", "chatApp");
        data.append("cloud_name", "deid8tlfv");

        axios.defaults.withCredentials = false;
        const uploadResponse = await axios.post("https://api.cloudinary.com/v1_1/deid8tlfv/image/upload", data);

        imgUrl = uploadResponse.data.url;
        console.log("URL : ", imgUrl)
      }

      axios.post('http://localhost:4090/auth/signUp', { name, email, password, imgUrl })
        .then(res => {
          if (res) {
            if (res.data === "added")
              navigate("/signIn")
            else
              setErrorMsg(res.data)
          }
        })
        .catch(err => console.log("signUp response error :", err))
    }
    catch(err)
    {
      console.log("singup error : ",err)
    }
  }


  return (
    <div>
      <form  onSubmit={handleSubmit}>
      <label htmlFor="">Name :</label><br />
      <input type="text"  onChange={(e)=>setName(e.target.value)} required/>
      <br/><br />
      <label htmlFor="">Email :</label><br />
        <input type="email"  onChange={(e) => setEmail(e.target.value)} required />
      <br/><br />
      <label htmlFor="">Password :</label><br />
        <input type="password"  onChange={(e) => setPassword(e.target.value)} required autoComplete='off' />
      <br /><br />
      <label htmlFor="">Confirm Password :</label><br />
        <input type="password" onChange={(e) => setConfirmPassord(e.target.value)} required autoComplete='off' />
      <br/><br />
      <label htmlFor="">Profile picture :</label><br />
      <input type="file"  onChange={(e)=>setProfile(e.target.files[0])} />
      <br/><br />
      <button type='submit'>SignUp</button>
      {(errorMsg&&errorMsg.length>0)?<p style={{color:'red'}}>{errorMsg}</p>:null}
      </form>
    </div>
  )
}




export default SignUp
