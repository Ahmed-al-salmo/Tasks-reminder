import React,{useState} from "react";
import { auth } from "../../firebase/config"
import { signOut } from "firebase/auth";
import Loadding from "../loadding";

export default function NavBar() {
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            try {
                setIsLoggingOut(true);
                await signOut(auth);
                console.log("User signed out successfully.");
            }catch(err){
                console.error("Error signing out: ", err);
            }
        }

    return(
            <button onClick={(e)=>handleLogout(e)} className="flex justify-center items-center gap-4 bg-red-600 text-white font-bold w-[90%] ml-[5%] my-3 py-2 rounded-lg shadow-xl/30 hover:bg-red-500 cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ">
                {isLoggingOut&& <Loadding style1="w-[20px] h-[20px] " style2="bg-red-500" />}
                { isLoggingOut?"Logging out..." : "Log out"}
            </button>
       
    );
}