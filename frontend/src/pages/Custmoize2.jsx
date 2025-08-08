import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function Custmoize2() {

    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(UserDataContext);
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUpdateAssistant = async () => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }

            const response = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
            setLoading(false);
            console.log(response.data);
            setUserData(response.data);
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
            <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white text-[30px] cursor-pointer w-[25px] h-[25px]' onClick={() => navigate("/customize")} />
            <h1 className='text-white mb-[30px] text-[40px] text-center'>Enter Your <span className='text-[#0000ff]'>AI Assistant</span> Name</h1>
            <input type="text" placeholder='Eg: John Doe' className='w-full max-w-[500px] h-[60px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl text-white text-[18px] font-semibold p-[10px] outline-none' required value={assistantName} onChange={(e) => setAssistantName(e.target.value)} />

            {assistantName && <button className='min-w-[300px] h-[60px] mt-[30px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer'
                disabled={loading}
                onClick={() => handleUpdateAssistant()}>{loading ? "Creating..." : "Create Your Assistant"}</button>}
        </div>
    )
}

export default Custmoize2   