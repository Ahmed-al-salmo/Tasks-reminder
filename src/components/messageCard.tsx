import React,{useState, useEffect} from "react";
import {auth} from "../firebase/config";
import { FaCheckCircle } from "react-icons/fa";

type MessageCardProps = {
    task:string;
    massageId:string;
    sendFrom:string;
    sendTime:string;
    status:boolean;
    sendHour:string;
    onClick1: () => void;
    onClick2: () => void;
    theme:string
}
export default function MessageCard({task,massageId,sendFrom,sendTime,status,sendHour,onClick1,onClick2,theme}:MessageCardProps){

    return(
        <div key={massageId} className={`max-w-[80%]  p-2 m-2 rounded-lg ${sendFrom === auth.currentUser?.email ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}  `}>
            <p className="text-lg ">{task}</p>

            <div className="flex justify-between items-end gap-5 ">
                <div className="flex items-center ">
                    <button 
                        onClick={onClick1} 
                        className=" text-xs bg-red-500 text-white px-2 py-1 rounded-lg mt-2 m-1 hover:bg-red-700 transition duration-300 cursor-pointer " 
                    >
                            Delete
                    </button>
                    {
                        !status ? <button 
                            onClick={onClick2} 
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg mt-2 m-1 hover:bg-green-700 transition duration-300 cursor-pointer" 
                        >
                                Done
                        </button>:
                        <FaCheckCircle className=" text-green-500 bg-white rounded-full text-xl" />
                    }
                </div>
                <p className="text-xs">{sendHour.substring(0,5)}</p>
            </div>
        </div>
    );
}