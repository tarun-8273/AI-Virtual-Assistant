import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from '../assets/ai.gif';
import userImg from '../assets/user.gif';
import { CgMenuRight } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';

function Home() {

  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isRecognitionRef = useRef(false);

  const [hamMenu, setHamMenu] = useState(false);

  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);

  const synth = window.speechSynthesis;

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  const handleLogOut = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/signin');
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  }

  const cleanupRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
      recognitionRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    isRecognitionRef.current = false;
    setListening(false);
  };

  const startRecognition = () => {
    if (isRecognitionRef.current || !window.SpeechRecognition && !window.webkitSpeechRecognition) {
      return;
    }

    if (!isSpeakingRef.current && !isRecognitionRef.current) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current?.start();
          setListening(true);
        }
      } catch (error) {
        if (!error.message.includes("start")) {
          console.error("Error starting recognition:", error);
        }
      }
    }
  }


  const speak = (text) => {
    return new Promise((resolve) => {
      // Stop speech recognition while speaking to avoid interference
      if (recognitionRef.current && isRecognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors when stopping
        }
        isRecognitionRef.current = false;
        setListening(false);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      const voices = window.speechSynthesis.getVoices();
      const hindiVoices = voices.find(voice => voice.lang === 'hi-IN');
      if (hindiVoices) {
        utterance.voice = hindiVoices;
      }

      isSpeakingRef.current = true;

      utterance.onend = () => {
        setAiText("");
        isSpeakingRef.current = false;
        // Restart recognition after speaking
        setTimeout(() => {
          startRecognition();
        }, 800);
        resolve();
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        // Restart speech recognition even if speech fails
        restartTimeoutRef.current = setTimeout(() => {
          if (!isSpeakingRef.current) {
            startSpeechRecognition();
          }
        }, 1000);
        resolve();
      };

      synth.speak(utterance);
    });
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === 'google_search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === 'instagram_open') {
      window.open(`https://www.instagram.com`, '_blank');
    }
    if (type === 'facebook_open') {
      window.open(`https://www.facebook.com`, '_blank');
    }
    if (type === 'twitter_open') {
      window.open(`https://x.com/`, '_blank');
    }
    if (type === 'linkedin_open') {
      window.open(`https://www.linkedin.com`, '_blank');
    }
    if (type === 'youtube_open') {
      window.open(`https://www.youtube.com`, '_blank');
    }
    if (type === 'google_open') {
      window.open(`https://www.google.com`, '_blank');
    }
    if (type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if (type === 'youtube_play' || type === 'youtube_search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  const startSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    // Don't start if already listening or speaking
    if (isRecognitionRef.current || isSpeakingRef.current) {
      return;
    }

    // Clean up any existing recognition
    cleanupRecognition();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    let isMounted = true; //flag to avoid setState on unmounted component

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognitionRef.current) {
        try {
          recognition.start();
          console.log("Recognition request to start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Error starting recognition:", error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognitionRef.current = true;
      setListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();

      if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        try {
          // Stop current recognition
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          setAiText("");
          setUserText(transcript);
          recognition.stop();
          isRecognitionRef.current = false;
          setListening(false);
          const data = await getGeminiResponse(transcript);
          if (data?.response) {
            handleCommand(data);
            setAiText(data.response);
            setUserText("");
          }
        } catch (error) {
          console.error('Error getting response:', error);
          // Restart recognition after error
          restartTimeoutRef.current = setTimeout(() => {
            if (!isSpeakingRef.current) {
              startSpeechRecognition();
            }
          }, 1000);
        }
      }
    };

    recognition.onend = () => {
      isRecognitionRef.current = false;
      setListening(false);

      // Restart recognition if not speaking
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error("Error restarting recognition:", error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      isRecognitionRef.current = false;
      setListening(false);

      // Only restart for certain error types
      if (event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error("Error restarting recognition:", error);
              }
            }
          }
        }, 1000);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      isRecognitionRef.current = false;
      setListening(false);
    }
  };

  useEffect(() => {
    // Speech synthesis initialization
    window.speechSynthesis.onvoiceschanged = () => {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name}, what can I help you with?`);
      greeting.lang = 'hi-IN';
      greeting.onend = () => {
        setTimeout(() => {
          startSpeechRecognition(); // start listening after speech
        }, 800);
      };
      window.speechSynthesis.speak(greeting);
    };

    // Only start recognition if userData is loaded
    if (userData?.assistantName) {
      startSpeechRecognition();
    }

    // Cleanup function
    return () => {
      cleanupRecognition();
      // Stop any ongoing speech synthesis
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    };
  }, [userData?.assistantName])



  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[20px] overflow-hidden'>
      <CgMenuRight className='lg:hidden text-[20px] text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHamMenu(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${hamMenu ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-1000`}>
        <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHamMenu(false)} />
        <button className='min-w-[150px] h-[60px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</button>
        <button className='min-w-[150px] h-[60px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer px-[20px] py-[10px]' onClick={() => navigate('/customize')}>Customize Your Assistant</button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white text-[20px] font-semibold'>History</h1>
        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col'>
          {userData?.history?.map((his) => (
            <span className='text-gray-200 text-[18px]'>{his}</span>
          ))}
        </div>
      </div>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer absolute top-[30px] right-[20px] hidden lg:block' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black bg-white rounded-[10px] text-[18px] font-semibold cursor-pointer absolute top-[100px] right-[20px] px-[20px] py-[10px] hidden lg:block' onClick={() => navigate('/customize')}>Customize Your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="assistant" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[20px] font-semibold'>I'm <span className='text-[#0000ff]'>{userData?.assistantName}</span></h1>

      {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
      {aiText && <img src={aiImg} alt="" className='w-[200px]' />}

      <h1 className='text-white text-[20px] font-semibold text-wrap'>{userText ? userText : aiText ? aiText : null}</h1>
    </div>
  )
}

export default Home;