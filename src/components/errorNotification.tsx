
import React,{useState, useEffect} from "react";

type ErrorProps ={
    setErrorData:React.Dispatch<React.SetStateAction<{isError:boolean,errorMessage:string}>>;
    errorMessage:string
}

export default function ErrorNotification ({setErrorData, errorMessage}:ErrorProps){

    return (
        <div className={`max-w-[600px] max-[768px]:w-[80%]  bg-red-500 fixed top-40 left-[50%] -translate-x-[50%] p-10 rounded-2xl text-white font-bold text-2xl`}>
            <p>{errorMessage}</p>
            <button 
                onClick={()=>setErrorData({isError:false, errorMessage:''})}
                className="py-2 w-[100px] text-center text-lg text-black bg-white rounded-xl mt-4 cursor-pointer hover:bg-gray-200"
            >
                ok
            </button>
        </div>
    );
}