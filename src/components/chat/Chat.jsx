import { useEffect, useState ,useRef} from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {db} from "../../lib/firebase"
import { useChatStore } from "../../lib/ChatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";


const Chat=()=>{
  const [open,setOpen]=useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState()
  const [img, setImg] = useState({
    file:null,
    url:"",
  })


  const endRef=useRef(null);

  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked}=useChatStore();
  const {currentUser}=useUserStore();


  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior: "smooth"})
  },[]);
  
  useEffect(()=>{
    const unSub=onSnapshot(doc(db,"chats",chatId),(res)=>{
      setChat(res.data())
    })

    return ()=>{unSub();} 
  },[chatId])

  const handleEmoji=(e)=>{
    setMessage((prev)=>prev + e.emoji)
    setOpen(false)
  }
  

  const handleSend = async () => {
    if (message === "") return;
    let imgUrl=null
    try {
      if(img.file){
        imgUrl = await upload(img.file);
      }
      // Update the chat document with the new message
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: message,
          createdAt: new Date(),
          ...(imgUrl && {img:imgUrl}),
        }),
      });
  
      const userIds = [currentUser.id, user.id];
  
      // Update userChats documents for each user involved in the chat
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);
  
        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
  
          // Find the index of the chat in the user's chat list
          const chatIndex = userChatData.chats.findIndex((c) => c.chatId === chatId);
  
          // Update the existing fields correctly
          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = message;
            userChatData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
            userChatData.chats[chatIndex].updatedAt = Date.now();
  
            // Update the userchats document with the updated chats array
            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            });
          }
        }
      });
  
    } catch (err) {
      console.log(err);
    }
    setMessage('');
    setImg({
      file:null,
      url:""
    })
  };
  const handleImage=(e)=>{
    if(e.target.files){
    setImg({
      file:e.target.files[0],
      url:URL.createObjectURL(e.target.files[0])
    })
  }
  }
  
  return(
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"}/>
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.email}
            </p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png"/>
          <img src="./video.png"/>
          <img src="./info.png"/>
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map(message=>(
              <div className={message.senderId === currentUser.id ? "message own":"message"}>
                <div className="texts">
                  {message.img&& <img src={message.img}/>}
                <p>{message.text}</p>
                {/* <span>1 min ago</span> */}
                </div>
              </div>
            )
        )
        }{
          img.url && 
          <div className="message own">
            <div className="texts">
              <img src={img.url} className="imgText"/>
            </div>
          </div>
        }
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
            <label htmlFor="file">
              <img src="./img.png" alt=""/>
            </label>
            <input type="file" id="file" style={{display:"none"}} onChange={handleImage}/>
            <img src="./camera.png" alt=""/>
            <img src="./mic.png" alt=""/>
        </div>
        <input 
        type="text" 
        placeholder={(isCurrentUserBlocked || isReceiverBlocked)?"You cannot send message":"Type a message..."}
        value={message}
        onChange={(e)=>{setMessage(e.target.value)}}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <div className="picker"><EmojiPicker open={open} onEmojiClick={handleEmoji}/></div>
          <img src="./emoji.png" alt="" onClick={()=>{setOpen(!open)}}/>
          
        </div>
        <button className="sendbutton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>

    </div>
  )
}
export default Chat;