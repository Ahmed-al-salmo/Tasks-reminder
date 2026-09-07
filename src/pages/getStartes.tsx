import React,{useState,useEffect} from "react";
import CreateAccount from "../components/createAccount/createAccount";
import Login from "../components/login/login";


export default function GetStartes() {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('')

    useEffect(()=>{
        const theme = localStorage.getItem('themeOfTaskRemainder');
        if(theme===null){
            setTheme('light')
        }else if(theme==='light'){
            setTheme('light')
        }else if(theme==='dark'){
            setTheme('dark')
        }
    },[])
    

    return(
        <div className={`w-full min-h-screen flex justify-center items-center ${theme==='dark' && "bg-gray-800" } `} >
            {
                isLogin ? <Login theme={theme} setIsLogin={setIsLogin}/> : <CreateAccount theme={theme} setIsLogin={setIsLogin}/>
            }
            
        </div>
    );
}