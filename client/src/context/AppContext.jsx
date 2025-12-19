import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {dummyChats, dummyUserData} from '../assets/assets' 

const AppContext = createContext()

export const AppContextProvider = ({children})=>{
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [chats,setChats] = useState([]);
    const [selectedChat,setSelectedChat] = useState(null);
    const [theme,setTheme] = useState(localStorage.getItem('theme')|| 'light');
    
    const fetchUser = async ()=>{
        setUser(dummyUserData)
    }
    const fetchUserChats = async()=>{
        setChats(dummyChats)
        setSelectedChat(null)
    }
    
    
    // Apply theme when theme state changes
    useEffect(()=>{
        const isDark = theme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        // Debug: log theme and whether html has the class
        try {
            // eslint-disable-next-line no-console
            console.debug('[AppContext] theme ->', theme, 'html has .dark ->', document.documentElement.classList.contains('dark'))
        } catch (e) {}
    },[theme])

    useEffect(()=>{
        if(user){
            fetchUserChats()
        }else{
            setChats([])
            setSelectedChat(null)
        }
    },[user])


    useEffect(()=>{
        fetchUser();
    },[])

    const value = {
        navigate,user,setUser,fetchUser,chats,setChats,selectedChat,setSelectedChat,theme,setTheme
    }
    return(

        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>)
        
    }

export const useAppContext = ()=>useContext(AppContext);