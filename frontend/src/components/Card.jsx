import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

function Card({ image }) {

    const { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);

    return (
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 transition-all duration-300 cursor-pointer hover:border-4 hover:border-white ${selectedImage == image ? 'border-4 border-white shadow-2xl shadow-blue-950' : null}`}
            onClick={() => { setSelectedImage(image); setBackendImage(null); setFrontendImage(null) }}>
            <img src={image} className='h-full object-cover rounded-2xl overflow-hidden' />
        </div>
    )
}

export default Card