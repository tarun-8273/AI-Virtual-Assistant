import React, { createContext, useEffect, useState } from 'react'
export const UserDataContext = createContext();
import axios from 'axios';

function UserContext({ children }) {

    const serverUrl = 'https://ai-virtual-assistant-y8gd.onrender.com'

    const [userData, setUserData] = useState(null);

    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true,
            });
            setUserData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value = {
        serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }

    return (
        <div>
            <UserDataContext.Provider value={value}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext 
