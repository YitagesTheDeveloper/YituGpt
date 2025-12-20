import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'
const Sidebar = ({isMenuOpen,setIsMenuOpen}) => {

    const {chats,setSelectedChat,theme,setTheme,user,navigate,createNewChat,fetchUserChats,setChats,setToken,axios,token} = useAppContext()
    const [search,setSearch] = useState('')

    const logout = () =>{
        localStorage.removeItem('token')
        setToken(null)
        toast.success('Logged out successfully')
    }

    const deleteChat = async (e, chatId) =>{
        try {
            e.stopPropagation()
            const confirm = window.confirm('Are you sure want to delete this chat?')
            if(!confirm) return
            const {data} = await axios.post('/api/chat/delete',{chatId},{headers:{Authorization:token}})
            if(data.success){
                setChats(prev =>prev.filter(chat =>chat._id !==chatId))
                await fetchUserChats()
                toast.success(data.message)
            }
        } catch (error) {
                toast.error(error.message)
        }
    }
    
  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 bg-linear-to-b from-white/40 to-white/20 dark:bg-linear-to-b dark:from-[#242124]/40 dark:to-black/40 text-black dark:text-white border-r border-[#80609F]/30 backdrop-blur-lg transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
        {/* Logo */}
        <img src={theme ==='dark' ? assets.logo1_full:assets.logo1_full_dark} alt='logo' className='w-full -my-12 max-w-60 -mx-7'/>
        
        {/* New chat button */}
        <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-10 text-white bg-linear-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'>
            <span className='mr-2 text-xl'>+</span> New Chat
        </button> 
        {/* Search Conversations */}
        <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 rounded-md dark:border-white/20'>
            <img src={assets.search_icon} className='w-4 not-dark:invert' alt="" />
            <input onChange={(e)=>setSearch(e.target.value)} value={search} type="text"
            placeholder= 'Search conversations' className='text-xs outline-none placeholder:text-gray-400'/>
        </div>
        {/* Recent chats */}
        { chats.length > 0 && <p className='mt-4 text-sm ' onClick={() => setIsMenuOpen(false)}>Recent Chats</p>}
        <div className='flex-1 mt-3 space-y-3 overflow-y-scroll text-sm'>
            {
                chats.filter((chat)=> chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()):chat.name.toLowerCase().includes(search.toLowerCase())).map((chat)=>(
                    <div key={chat._id} onClick={()=>{navigate('/'); setSelectedChat(chat);setIsMenuOpen(false)}} className='p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group'>
                        <div>
                            <p className='w-full truncate'>
                                {chat.messages.length > 0? chat.messages[0].content.slice(0,32) :chat.name}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
                                {moment(chat.updatedAt).fromNow()}
                            </p>
                        </div>
                        <img onClick={e=>toast.promise(deleteChat(e,chat._id),{loading:"deleting..."})} src={assets.bin_icon}  className='hidden w-4 cursor-pointer group-hover:block not-dark:invert' alt=""/>
                    </div>
                ))
            }
        </div>
        {/* Community Images */}
        <div onClick={()=>{navigate('/community');setIsMenuOpen(false)}} className='flex items-center gap-2 p-3 mt-4 transition-all border border-gray-300 rounded-md cursor-pointer dark:border-white/15 hover:scale-103'>
            <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' alt="" />
            <div className='flex flex-col'>
                <p>Community Images</p>
            </div>
        </div>
        
        {/* Credit Purchases Option */}
        <div onClick={()=>{navigate('/credits');setIsMenuOpen(false)}} className='flex items-center gap-2 p-3 mt-4 transition-all border border-gray-300 rounded-md cursor-pointer dark:border-white/15 hover:scale-103'>
            <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt="" />
            <div className='flex flex-col'>
                <p>Credits: {user?.credits}</p>
                <p className='text-xs text-gray-400'>Purchase credits to use yitugpt</p>
            </div>
        </div>
         {/* Dark Mode Toggle */}
        <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 rounded-md dark:border-white/15 '>
            <div className='flex items-center gap-2 text-sm'>
                <img className='w-4 not-dark:invert' src={assets.theme_icon} alt=""/>
                <p>Dark Mode</p>
            </div>
            <label className="relative inline-flex cursor-pointer">
                <input className='sr-only peer' type="checkbox" checked={theme === 'dark'} onChange={()=>setTheme(theme === 'dark' ? 'light' : 'dark')}/>
                <div className='h-5 transition-all bg-gray-400 rounded-full w-9 peer-checked:bg-purple-600'>
                </div>
                <span className='absolute w-3 h-3 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-4'>
                    
                </span>
            </label>
        </div>
        {/* User account */}
        <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 rounded-md cursor-pointer dark:border-white/15 group'>
            <img src={assets.user_icon} className='rounded-full w-7' alt="" />
            <p className='flex-1 text-sm truncate dark:text-primary'>{user? user.name : 'Login your account'}</p>
            {user && <img onClick={logout} src={assets.logout_icon} className='hidden h-5 cursor-pointer not-dark:invert group-hover:block'/>}
        </div>
        <img onClick={()=>setIsMenuOpen(false)} src={assets.close_icon}  className="absolute w-5 h-5 cursor-pointer top-3 right-3 md:hidden not-dark:invert" alt=""/>
    </div>
  )
}

export default Sidebar