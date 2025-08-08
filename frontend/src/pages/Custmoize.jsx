import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import bg from '../assets/authBg.png'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { RiImageAddLine } from 'react-icons/ri'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from 'react-icons/md';

function Custmoize() {

    const { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);

    const navigate = useNavigate();

    const inputImage = useRef();

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
            <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white text-[30px] cursor-pointer w-[25px] h-[25px]' onClick={() => navigate("/")}  />
            <h1 className='text-white mb-[30px] text-[40px] text-center'>Select Your <span className='text-[#0000ff]'>AI Assistant</span></h1>
            <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />
                <Card image={bg} />

                <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 transition-all duration-300 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage == "input" ? 'border-4 border-white shadow-2xl shadow-blue-950' : null}`} onClick={() => {
                    inputImage.current.click();
                    setSelectedImage("input")
                }}>
                    {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px] text-2xl' />}
                    {frontendImage && <img src={frontendImage} className='h-full object-cover' />}
                </div>
                <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
            </div>

            {selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer' onClick={() => navigate("/customize2")}>Next</button>}

        </div>
    )
}

export default Custmoize