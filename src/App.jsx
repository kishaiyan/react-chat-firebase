import React from 'react'; // Import React if using older versions
import Chat from './components/chat/Chat';
import List from './components/list/List';
import Detail from './components/detail/Detail'; // Ensure correct case
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./lib/firebase";
import { useChatStore } from './lib/ChatStore';
import { useEffect } from 'react';
import { useUserStore } from './lib/userStore';

const App = () => {
  const {currentUser,isLoading,fetchUserInfo}=useUserStore()
  const {chatId}=useChatStore();

  useEffect(()=>{
    const unSub= onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
    });
    return ()=>{
      unSub();
    }
  },[fetchUserInfo]);
  console.log(currentUser);
  
  if (isLoading) return (<div className='loading'>Loading...</div>)
  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List />
          {chatId&&<Chat />}
          {chatId&&<Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
