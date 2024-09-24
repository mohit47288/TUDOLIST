import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import '../index.css';


function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    

    const createUser = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("You are signed up successfully");
            navigate("/Login");
            setEmail("");  // Reset email
            setPassword("");  // Reset password 
        })
        .catch(err => alert("Error: " + err.message));
    };

    return (
        <div className="flex items-center justify-center min-full-screen bg-gray-100 mx-auto  mt-24">
            <div className="bg-green p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">Signup Page</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        type='email'
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-cyan-300"
                        onChange={e => setEmail(e.target.value)}  
                        placeholder='Enter your email'
                        value={email}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input 
                        type='password'
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setPassword(e.target.value)}
                        placeholder='Enter your password'
                        value={password}
                        required
                    />
                </div>

                <button 
                    onClick={createUser}
                    className="w-full bg-teal-500 hover:bg-teal-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Sign Up
                </button>

                <p className="text-center my-4 text-gray-600">Or</p>
                <p>Already have an account? <Link to ="Login"> Login </Link ></p>
            </div>
        </div>
    );
}

export default SignUp;