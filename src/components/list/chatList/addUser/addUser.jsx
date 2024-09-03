import { arrayUnion, collection, doc, getDocs, query,serverTimestamp,setDoc,updateDoc,where } from 'firebase/firestore';
import './addUser.css';
import { db } from '../../../../lib/firebase';
import { useUserStore } from '../../../../lib/userStore';
import { useState } from 'react';

const AddUser=()=>{
  const [user, setUser] = useState(null)
  const {currentUser}=useUserStore()
  const handleSearch=async(e)=>{
    e.preventDefault()
    const formData=new FormData(e.target)
    const username=formData.get("username")

    try {
      const userRef=collection(db,"users")
      const q=query(userRef,where("username","==",username))
      const querySnapshot=await getDocs(q);
        if(!querySnapshot.empty){
          setUser(querySnapshot.docs[0].data())
        }
    } catch (error) {
      console.log(error); 
    }
  };
  const handleAddChat=async()=>{
    const chatRef=collection(db,"chats")
    const userChatRef=collection(db,"userchats")

    try {
      const newChatRef=doc(chatRef)
     
      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages:[],
      });

      await updateDoc(doc(userChatRef,user.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastmessage:'',
          receiverId:currentUser.id,
          updatedAt:Date.now(),
        }),
        
      });

      await updateDoc(doc(userChatRef,currentUser.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastmessage:'',
          receiverId:user.id,
          updatedAt:Date.now(),
        }),
      });
    } catch (err) {
      console.log(err)
    }
  }
  return(
  <div className="adduser">
    <form onSubmit={handleSearch}>
      <input type="text" placeholder="Username" name="username"/>
      <button>search</button>
    </form>
   { user && <div className="user">
      <div className="detail">
        <img src={user.avatar || "./avatar.png"} />
        <span>{user.username}</span>
      </div>
      <button onClick={handleAddChat}>Add User</button>
    </div>}
  </div>)
}

export default AddUser;