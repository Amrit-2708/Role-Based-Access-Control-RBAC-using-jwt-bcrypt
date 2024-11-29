import React, { useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

//toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components
import Spinner from "./spinner";
import Navbar from './Navbar'

const ChangePassword = () => {
    const [newPass, setNewpass] = useState();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const isbtnValid = newPass;

    function handlePasswordChange(e) {
        e.preventDefault();
        setLoading(true);
        axios.patch(`http://localhost:3001/change_password/${id}`,
            { newPass },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          ).then((result) => {
                toast.success("Password Changed Succesfully", { autoClose: 2000 });
                setTimeout(() => {
                    navigate(`/org/${id}`);
                }, 2000);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(`${error.response.data.message}. Please try again`, { autoClose: 2000 })
                setLoading(false);
            });
    }

    function handleCancelEdit() {
        navigate(`/org/${id}`);
    }

    return (
        <div>
            <Navbar />
            <div className='bg-cyan-900 flex justify-center items-center h-screen'>
                <div className='w-auto sm:w-auto md:w-auto lg:w-auto flex flex-col items-start border-8 border-yellow-500 overflow-x-auto'>
                    <div className='flex flex-col mt-5 ml-8 mb-8'>
                        <span className='text-2xl text-white font-bold'>ID</span>
                        <span className='text-white pr-12'>{id}</span>
                    </div>
                    <div className='flex flex-col ml-8 mb-8'>
                        <span className='text-xl text-white font-semibold mb-2'>Enter New Password</span>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter new password"
                            required
                            onChange={(e) => setNewpass(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-2 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>

                    <div className="ml-8 mb-5 mr-8 flex flex-col sm:flex-col md:flex-col lg:flex-row lg:space-x-24">
                        <button
                            disabled={!isbtnValid}
                            onClick={handlePasswordChange}
                            className={`w-[150px] flex justify-center items-center h-10 px-4 font-semibold rounded-md mb-4 sm:mb-4 lg:mb-0 border border-slate-200 text-white bg-black ${isbtnValid ? "bg-black" : "bg-gray-500"}`}
                        >
                            {loading && <Spinner color={"white"} width={"w-5"} />} Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="w-[150px] h-10 px-4 font-semibold rounded-md mb-4 sm:mb-4 lg:mb-0 border border-slate-200 text-white bg-black"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ChangePassword
