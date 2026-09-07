import React,{useEffect, useState} from "react";
import { IoSend } from 'react-icons/io5';
import { FaCalendar } from "react-icons/fa";
import {db, auth} from "../firebase/config";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { IoCalendarOutline } from "react-icons/io5";

type TaskType ={
    task:string;
    sendTo:string;
    sendFrom:string;
    sendTime:string;
    achiveTime:string;
    sendHour:string;
    status:boolean;
}

export default function CreateTaskForm({sentTo, setIsRefreash,theme}:{sentTo:string,theme:string , setIsRefreash:React.Dispatch<React.SetStateAction<boolean>>}){
    const collectionRefTasks = collection(db, "tasks");
    const collectionRefUsers = collection(db, "users");
    const [date,setDate]=useState('')
    const [taskInput, setTaskInput] = useState<TaskType>({
        task:"",
        sendTo:"",
        sendFrom:"",
        sendTime:"",
        sendHour:'',
        achiveTime:"",
        status:false,
    });

    useEffect(()=>{
        const fetchSendToUserId = async () => {
            try {
                const querySnapshot = await getDocs(collectionRefUsers);

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if(doc.id === sentTo){

                        console.log("SendTo user ID: ", data.email);
                        setTaskInput({
                            ...taskInput,
                            sendFrom:auth.currentUser?.email || "",
                            sendTime:new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                            sendHour:new Date().getHours() + ":" + new Date().getMinutes(),
                            sendTo:data.email
                        })
                    }
                });
            } catch (error) {
                console.error("Error fetching sendTo user ID: ", error);
            }
        };
        fetchSendToUserId();
    },[sentTo])

    const submitHandler =async ()=>{
        setTaskInput({
            ...taskInput,
            sendTime:new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() ,
            sendHour:new Date().getHours() + ":" + new Date().getMinutes(),
        });

        try{
            await addDoc(collectionRefTasks, taskInput);
            setIsRefreash(true)
            setTaskInput({
                ...taskInput,
                task:"",
            })
        }catch(error){
            console.error("Error adding document: ", error);
        }
    }

    return(
            <form className={`w-full flex items-center gap-2 p-2  ${theme==='dark'? 'bg-gray-800 text-white': 'bg-white' }`}>
                <input onChange={(e)=>setTaskInput({...taskInput ,task:e.target.value})} value={taskInput.task || ""} type="text" placeholder="Enter task..." className="  border border-gray-500 rounded-full p-2 w-full shadow-lg/20 outline-none pr-14" />
                
                <div onClick={submitHandler} className="  rounded-full border-1 border-gray-500 w-[40px] h-[40px] text-blue-500 flex items-center justify-center hover:text-blue-700  cursor-pointer">
                    <IoSend className=" "/>
                </div>
            
            </form>

    );
}