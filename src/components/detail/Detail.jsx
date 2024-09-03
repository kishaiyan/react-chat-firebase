import { auth, db } from "../../lib/firebase";
import "./detail.css"
import { useChatStore } from "../../lib/ChatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail=()=>{

  const {user,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=useChatStore()
  const {currentUser}= useUserStore()

  const handleBlock=async ()=>{
    if(!user) 
     {
      console.log("exited")
      return;
     }

    const userDocRef=doc(db,"users",currentUser.id)
    try {
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock();
      
    } catch (err) {
      console.log(err);
    }
  }
  return(
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"}/>
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src="./arrowUp.png" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy</span>
            <img src="./arrowUp.png" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail"><img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"/>
              <span>random name</span>
              
            </div>
               <img src="./download.png" alt="" className="icon"/></div>
            <div className="photoItem">
              <div className="photoDetail">
              <img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"/>
              <span>random name</span>
              </div>
              <img src="./download.png" alt="" className="icon"/>
              
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"/>
                <span>random name</span>
              </div>
                <img src="./download.png" alt="" className="icon"/>
             
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"/>
                <span>random name</span>
              </div>
                <img src="./download.png" alt="" className="icon"/>
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src="./arrowUp.png" />
          </div>
        </div>
        <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are blocked": isReceiverBlocked ? "Unblock" : "Block"}</button>
        <button className="logout" onClick={()=>auth.signOut()}>logout</button>
      </div>
    </div>
  )
}
export default Detail;