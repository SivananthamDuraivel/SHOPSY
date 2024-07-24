import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = async (e) => {
        console.log("entered signIn");
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4090/auth/signIn', { email, password });
            console.log(response.data);
            if (response.data === "valid") {
                navigate("/allProducts");
            } 
            else if(response.data==="admin"){
                navigate("/adminPage")
            }
            else {
                setErrorMsg(response.data);
            }
        } catch (err) {
            console.log("signIn response error: ", err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Email:</label><br />
                <input type="email" onChange={(e) => setEmail(e.target.value)} required />
                <br /><br />
                <label htmlFor="">Password:</label><br />
                <input type="password" onChange={(e) => setPassword(e.target.value)} required autoComplete='off' />
                <br /><br />
                <button type='submit'>SignIn</button>
                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            </form>
        </div>
    );
}

export default SignIn;
