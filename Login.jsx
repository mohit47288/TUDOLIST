import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import '../index.css';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signInUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((value) => {
                alert("You are successfully logged in");
                setEmail("");  // Reset email
                setPassword("");  // Reset password
                navigate("/todoList");  // Navigate to TodoList
            })
            .catch((err) => {
                console.log(err);
                alert("Login failed: " + err.message);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-indigo-50 px-8 sm:px-12 lg:px-16 mt-12">
    <div className="bg-indigo-800 p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">Welcome Back!</h1>
        <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-3"></label>
            <input 
                type='email'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-cyan-300"
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
            />
        </div>
        <div className="mb-8">
            <label className="block text-white text-sm font-semibold mb-3">Password</label>
            <input 
                type='password'
                className="w-full px-4 py-3 border border-indigo-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-400 placeholder-gray-400 bg-gray-100"
                placeholder='Enter your password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />
        </div>
        <button 
            onClick={signInUser} 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 transition ease-in-out duration-300 transform hover:scale-105">
            Sign In
        </button>
        <p className="text-center my-6 text-white opacity-75">Or</p>
        <p className="text-center text-white">New here? 
            <Link to="/" className="text-pink-300 hover:text-pink-400 font-semibold"> Register Now</Link>
        </p>
    </div>
</div>


    );
}

export default Login;