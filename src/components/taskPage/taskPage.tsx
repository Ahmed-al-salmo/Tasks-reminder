import React,{useState} from "react";
import CreateTaskForm from "../createTaskForm";
import MessagesContainer from "../messagesContainer/messagesContainer";

export default function TaskPage({sentTo, theme}:{sentTo:string, theme:string}){
    const [isRefreash, setIsRefreash] = useState<boolean>(false);
    return(
        <div className={`w-full h-screen  max-[768px]:w-full ${theme==='dark' && 'bg-gray-800' }`}>
            <MessagesContainer theme={theme} sendTo={sentTo} isRefreash={isRefreash}/>
            <CreateTaskForm theme={theme} sentTo={sentTo} setIsRefreash={setIsRefreash} />
        </div>
    )
}
