import React from "react";

type LoaddingProps ={
    style1:string;
    style2:string
}

export default function Loadding({style1,style2}:LoaddingProps){

    return (
        <div className=" w-fit bg-gray-400 rounded-full ">
            <div className={`animate-spin  border-4  border-gray-400 border-b-white rounded-full ${style1}`}> 
                <div className={`w-full h-full   rounded-full ${style2}`}></div>
            </div>
        </div>
    );
}


