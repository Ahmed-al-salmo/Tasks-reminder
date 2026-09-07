import React,{useState, useEffect} from "react";
import { FaList, FaArrowLeft,FaUser } from "react-icons/fa";
import { LuSettings } from "react-icons/lu"; 
import { db, auth } from "../../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Input from "../input";
import Loadding from "../loadding";
import ErrorNotification from "../errorNotification";

type User = {
    id: string;
    userName: string;
    email: string;
    image:''
}
type SideBarProps = {
    setSendTo:React.Dispatch<React.SetStateAction<string>>;
    setIsShowSideBar:React.Dispatch<React.SetStateAction<boolean>>;
    isShowSideBar:boolean;
    setIsShowSetting:React.Dispatch<React.SetStateAction<boolean>>;
    isShowSetting:boolean;
    isHideEmail:string;
    theme:string
}
type ChatWith ={
    user1:User,
    user2:User

}

export default function SideBar({setSendTo, isShowSideBar, setIsShowSideBar, setIsShowSetting,isHideEmail,theme}:SideBarProps){
    const [users, setUsers] = useState<User[]>([]);
    const [userChatWith, setUserChatWith] = useState<User[]>([]);
    const [filteredUser, setFilteredUser] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [isLoadding, setIsLoadding] = useState<boolean>(false)
    const [errorData, setErrorData] = useState<{isError:boolean, errorMessage:string}>({
        isError:false,
        errorMessage:''
    })
    useEffect(()=>{
        setIsLoadding(true)
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersData: User[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    usersData.push({
                        id: doc.id,
                        userName: data.userName,
                        email: data.email,
                        image:data.image
                    });
                });
                setUsers(usersData);
                setIsLoadding(false)
            } catch (error) {
                console.error("Error fetching users: ", error);
                setErrorData({
                    isError:true,
                    errorMessage:'You are not connected to the internet ,Fetching users failed, please reload'
                })
            }
        };
        const fetchChats = async ()=>{
            try{
                const querySnapshot = await getDocs(collection(db, "chats"));
                const data:ChatWith[] = querySnapshot.docs.map((doc)=>doc.data()) as ChatWith[];
                console.log(data)
                const chatWithList : User[] = []
                data.map((users)=>{
                    if(users.user1.email===auth.currentUser?.email){
                        chatWithList.push(users.user2)
                    }else if(users.user2.email===auth.currentUser?.email){
                        chatWithList.push(users.user1)
                    }
                })
                setUserChatWith(chatWithList)
            }catch(err){
                console.log(err)
                setErrorData({
                    isError:true,
                    errorMessage:'You are not connected to the internet ,Fetching Chats failed, plaese reload'
                })
            }
        }
        fetchChats()
        fetchUsers();
        
    },[isRefresh,isHideEmail])

    const filteringUser = (e:string)=>{
        setIsSearching(true);
        if(users.length>0){
            const filtered = users.filter((user)=>user.email.toLowerCase().includes(e.toLowerCase()));
            setFilteredUser(filtered);
        }
        if(e.trim().length===0){
            setIsSearching(false);
        }
    }

    const addChat =async (user:User)=>{
        const currentUserdata = users.filter((user)=>user.email===auth.currentUser?.email) 
        try{
            await addDoc(collection(db, "chats"), {
                user1:currentUserdata[0],
                user2:user
            });

            setSendTo(user.id);
            setIsSearching(false);
            setIsShowSetting(false)
            setIsRefresh(true);
        }catch(err){
            console.log(err)
            setErrorData({
                isError:true,
                errorMessage:'You lost connection, try again... '
            })
        }
    }

    return(
        <>
        
        <div className={`w-[300px] h-screen
            text-white  
            absolute 
            top-0
            left-0
            max-[768px]:w-full  
            py-4  z-50  
            transition-transform 
            duration-500 
            ease-in-out 
            ${(isShowSideBar) ? 'translate-x-0' : '-translate-x-full'}
            ${theme==='dark'? 'bg-gray-700':'bg-gray-300' }
            `} 
            
        >
            {errorData.isError && <ErrorNotification errorMessage={errorData.errorMessage} setErrorData={setErrorData} />}
            <div className="flex justify-between items-center ">
                <FaArrowLeft onClick={()=>setIsShowSideBar(false)} className={`text-xl cursor-pointer hover:text-gray-500 z-100 max-[768px]:hidden m-2 ${theme==='light' && 'text-black'}`}/>
                <LuSettings onClick={()=>setIsShowSetting(true)} className={`text-xl cursor-pointer hover:text-gray-500 z-100  m-2 ${theme==='light' && 'text-black'}`} />
            </div>
            <Input 
                label="" 
                type="text" 
                className={`w-[94%] mt-4 ml-[3%] p-2 rounded-2xl   focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${theme==='dark'? 'bg-gray-600 text-white':'bg-gray-400 text-black' } `} 
                onChange={(e)=>{filteringUser(e.target.value)}} 
                placeholder="Search users by email..."
            />
            <div className={`max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 ${theme==='light'?"text-black":"" } `}>
                {
                    isSearching?
                    (    filteredUser.length===0?
                        <p>No resoult found...</p>
                        :
                        filteredUser.map((user)=>(
                            <div key={user.id} className={` flex gap-3 p-2 cursor-pointer ${theme==='light' ? 'text-black hover:bg-gray-400 ' : "hover:bg-gray-600"}`} onClick={()=>addChat(user)}>
                                {
                                    user.image ? <img src={user.image} alt="" className={'w-[50px] h-[50px] rounded-full bg-red-300 '}  />:
                                    <FaUser className="w-[50px] h-[50px] bg-gray-500 rounded-full mx-3 " />
                                }
                                <div>
                                    <p className="text-xl">{user.userName} {user.email===auth.currentUser?.email? <span className="text-sm">(me)</span>:''} </p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        )))
                    :
                    userChatWith.length>0 ?
                        userChatWith.map((user)=>(
                        <div key={user.id} className={` flex gap-3 p-2 cursor-pointer ${theme==='light' ? 'text-black hover:bg-gray-400 ' : "hover:bg-gray-600"} `} onClick={()=>(setSendTo(user.id), setIsShowSideBar(false), setIsShowSetting(false))}>
                            {
                                user.image ? <img src={user.image} alt="" className={'w-[50px] h-[50px] rounded-full bg-red-300 '}  />:
                                <FaUser className="w-[50px] h-[50px] bg-gray-500 rounded-full mx-3 " />
                            }
                            <div>
                                <p className="text-xl">{user.userName} {user.email===auth.currentUser?.email? <span className="text-sm">(me)</span>:''} </p>
                                {isHideEmail==='false' && <p className="text-sm text-gray-500 ">{user.email}</p>}
                            </div>
                        </div>
                    )):
                    isLoadding ?
                        <div className="flex justify-center items-center h-[100px] "> 
                            <Loadding 
                                style1=" w-[40px] h-[40px] "
                                style2={` ${theme==='dark' ? 'bg-gray-600': 'bg-gray-300'} `} 
                            /> 
                        </div>:
                        <p className="p-4 text-xl font-bold ">No Chat Found, Search about users to start chating..</p>
                }
            </div>
        </div>
        </>
    );
}
