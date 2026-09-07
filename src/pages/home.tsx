import React,{useEffect, useState} from "react";
// import NavBar from "../components/navBar/navBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import SideBar from "../components/sideBar/sideBar";
import TaskPage from "../components/taskPage/taskPage";
import Setting from "../components/setting/setting";
import { FaList, FaArrowRight } from 'react-icons/fa';


export default function Home(){
    const [sentTo, setSendTo] = useState<string>('')
    const [isShowSideBar,setIsShowSideBar] = useState<boolean>(true);
    const [isShowSetting, setIsShowSetting] = useState<boolean>(false);
    const [isHideEmail, setIsHideEmail]=useState<string>('');
    const [isRefresh,setIsRefresh]= useState<boolean>(false);
    const [theme, setTheme]= useState<string>('')

    useEffect(()=>{
        const isHide:string|null = localStorage.getItem('isHideEmail');
        if(isHide === null){
            setIsHideEmail('false');
        }else{
            setIsHideEmail(isHide);
        }

        const theme = localStorage.getItem('themeOfTaskRemainder');
        if(theme==='null'){
            setTheme('light')
        }else if(theme==='light'){
            setTheme('light')
        }else if(theme==='dark'){
            setTheme('dark')
        }

        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(!user){
                window.location.href = "/";
            }
        })
        return ()=>{
            unsubscribe();
        }
    },[isRefresh])
    
    return (
        <div className={`relative h-screen w-screen ${theme==='dark'&& 'bg-gray-800'}`} >
            {/* <NavBar /> */}
            
            <SideBar 
                setSendTo={setSendTo} 
                isShowSideBar={isShowSideBar} 
                setIsShowSideBar={setIsShowSideBar} 
                setIsShowSetting={setIsShowSetting}
                isShowSetting={isShowSetting}
                isHideEmail={isHideEmail}
                theme={theme}
            />
            <Setting  
                setIsShowSetting={setIsShowSetting}
                isShowSetting={isShowSetting}
                isRefresh={isRefresh}
                setIsRefresh={setIsRefresh}
                isHideEmail={isHideEmail}
                theme={theme}
            />
            {!isShowSideBar && <FaArrowRight onClick={()=>setIsShowSideBar(true)} className={`absolute top-7 left-6  hover:text-gray-500 cursor-pointer ${theme==='dark'&& 'text-white' } `}  />}
            {sentTo!==""?  
                <TaskPage sentTo={sentTo} theme={theme} />:
                <div className="w-full h-screen flex justify-center items-center">
                    <p className="w-fit bg-gray-300 font-bold  p-3  rounded-2xl">Select a chat to start messaging</p>
                </div>
            }
            
        </div>
    );
}