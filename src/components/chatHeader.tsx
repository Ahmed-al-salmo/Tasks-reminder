import React from "react";
import { FaUser } from "react-icons/fa";

export default function ChatHeader({userName,theme,image}:{userName:string,theme:string,image:string}){
    return(
        <div className={`w-full h-[60px]  flex items-center pl-15 border-b-1 border-gray-300 ${theme==='dark'? 'bg-gray-700 text-white': 'bg-gray-200'}`}>
            {
            image ? 
                <img src={image} alt="" className={'w-[40px] h-[40px] rounded-full mx-3 '}  />:
                <FaUser className="w-[40px] h-[40px] bg-gray-500 rounded-full mx-3 " />
            }
            <p className="font-bold text-lg">{userName}</p>
        </div>
    )
}
