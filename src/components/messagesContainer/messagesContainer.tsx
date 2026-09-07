import React,{useState, useEffect} from "react";
import { db,auth } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc, updateDoc} from "firebase/firestore";
import MessageCard from "../messageCard";
import ChatHeader from "../chatHeader";
import Loadding from "../loadding";

type MessagesType ={
    massageId:string;
    task:string;
    sendTo:string;
    sendFrom:string;
    sendTime:string;
    sendHour:string;
    achiveTime:string;
    status:boolean;
}
type UserType = {
    id: string;
    userName: string;
    email: string;
    image:string
}

export default function MessagesContainer({sendTo, isRefreash, theme}:{sendTo:string, isRefreash:boolean, theme:string}){
    const collectionRefTasks = collection(db, "tasks");
    const [messages, setMessages] = useState<MessagesType[]>([]);
    const [userIdSentTo, setUserIdSentTo] = useState<string>('');
    const [userSendToData, setUserSendToData] = useState<UserType>({
        id: "",
        userName: "",
        email: "",
        image:''
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(()=>{
        const fetchUser =async ()=>{
            try{
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if(doc.id === sendTo){
                        setUserIdSentTo(data.email);
                        setUserSendToData({
                            id: doc.id,
                            userName: data.userName,
                            email: data.email,
                            image:data.image
                        });
                    }
                });
            }catch(error){
                console.error("Error fetching sendTo user ID: ", error);
            }
        }
        const fetchMessages = async () => {
            try {
                const querySnapshot = await getDocs(collectionRefTasks);
                const messagesData: MessagesType[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    
                        messagesData.push({
                            massageId: doc.id,
                            task: data.task,
                            sendTo: data.sendTo,
                            sendFrom: data.sendFrom,
                            sendTime: data.sendTime,
                            sendHour: data.sendHour,
                            achiveTime: data.achiveTime,
                            status: data.status,
                        });
                    
                });
                console.log("Fetched messages: ", messagesData);

                setMessages(messagesData);
                
            } catch (error) {
                console.error("Error fetching messages: ", error);
            }
        };

        

        fetchUser();
        fetchMessages();

    },[sendTo,isRefreash])

    const handleDeleteMessage = async (messageId: string) => {
        try{
            await deleteDoc(doc(db, "tasks", messageId));
            setMessages(messages.filter((message) => message.massageId !== messageId));
        }catch(err){
            console.log(err)
        }
    }

    const handleDoneTask = async (messageId: string) => {
        try{
            await updateDoc(doc(db, "tasks", messageId), {
                status: true
            });
            setMessages(messages.map((message) => {
                if(message.massageId === messageId){
                    return {...message, status: true};
                }
                return message;
            }));
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div  className={`w-full h-[90%] border-t-1 border-b-1 border-gray-300 overflow-auto flex flex-col ${theme==='dark' ? 'bg-gray-800': 'bg-gray-100 ' }`}>
            <ChatHeader theme={theme} userName={userSendToData.userName} image={userSendToData.image}/>
            <p className="bg-gray-400 w-[200px] text-center rounded-xl  py-1 self-center m-2 font-bold text-white">lets start tasking</p>
            {   
                messages.length >0 ?
                        messages.map((message)=>(
                            (message.sendTo === auth.currentUser?.email && message.sendFrom === userIdSentTo) || (message.sendFrom === auth.currentUser?.email && message.sendTo === userIdSentTo) ?
                            <MessageCard 
                                massageId={message.massageId} 
                                sendFrom={message.sendFrom} 
                                task={message.task} 
                                sendTime={message.sendTime} 
                                status={message.status} 
                                sendHour={message.sendHour}
                                onClick1={()=>handleDeleteMessage(message.massageId)}
                                onClick2={()=>handleDoneTask(message.massageId)}
                                theme={theme}
                            />
                            :null
                        ))
                    
                
                :<div className="flex justify-center items-center h-[100px] "> <Loadding style1=" w-[40px] h-[40px] " style2={` ${theme==='dark' ? 'bg-gray-800': 'bg-gray-300'} `} /> </div>
            }
        </div>
    )
}