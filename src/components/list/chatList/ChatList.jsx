import { onSnapshot,doc,getDoc, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/ChatStore";
import { db } from "../../../lib/firebase";
import AddUser from "./addUser/addUser";
import "./chatList.css"
import {useEffect, useState} from 'react';

const ChatList=()=>{
  const [addMode,setAddMode]=useState(false);
  const [chats,setChats]=useState([]);
  const [text,setText]=useState();

  const {currentUser}=useUserStore();
  const {changeChat}=useChatStore();

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"userchats",currentUser.id),async (res)=>{
      const items=res.data().chats;

      const promises = items.map(async(item)=>{
        const userDocRef=doc(db,'users',item.receiverId);
        const userDocSnap=await getDoc(userDocRef);

        const user=userDocSnap.data()

        return {...item,user}
      });

      const chatData=await Promise.all(promises)

      setChats(chatData.sort((a,b)=>b.updatedAt-a.updatedAt))
   
      return ()=>{
        unSub()
      }
    })
  },[currentUser.id])

  const handleSelect=async (chat)=>{
    const userChats=chats.map(item=>{
      const {user,...rest}=item;
      return rest;
    })

    const chatIndex=userChats.findIndex(item=>item.chatId === chat.chatId);
    userChats[chatIndex].isSeen=true;

    const userChatRef=doc(db,"userchats",currentUser.id);
    try {
      await updateDoc(userChatRef,{
        chats:userChats
      });
      changeChat(chat.chatId,chat.user)
      
    } catch (error) {
      console.log(error)
    }
  }
  const filteredChats = chats.filter(c => 
    c.user?.username?.toLowerCase().includes((text || "").toLowerCase())
  );
  

  return(
    <div className='chatlist'>
      <div className="search">
        <div className="searchBar">
          <img src='./search.png' alt="serach-icon"/>
          <input type="text" placeholder="Search" onChange={(e)=>setText(e.target.value)}/>
        </div>
        <img 
        src={addMode?"./minus.png":"./plus.png"}
        className="add"
        onClick={()=>{setAddMode(!addMode)}}
        />
      </div>
      {filteredChats.map(chat=>(
        <div className="item" id={chat.chatId} onClick={()=>handleSelect(chat)}
        style={{background:chat?.isSeen? "transparent":"blue"}}>
        <img src={(chat.user.blocked.includes(currentUser.id))
          ? "./avatar.png"
          : chat.user.avatar || "./avatar.png"}/>
        <div className="Texts">
         <span>{(chat.user.blocked.includes(currentUser.id))
         ? "User"
         : chat.user.username}</span>
         <p>{chat.lastMessage}</p>
        </div>
      </div> ))}
      
      
      {addMode&&<AddUser/>}
    </div>
  )
}
export default ChatList;