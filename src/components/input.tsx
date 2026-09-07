import React from "react";

type InputProps = {
    label: string;
    type: string;
    className: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder: string;
    theme?:string
}

export default function Input({label, type,className, onChange,placeholder,theme}: InputProps) {
    return(
        <>
            <label className={`${theme==='dark' && 'text-white'}`} >{label}</label>
            <input  type={type} className={className} onChange={onChange} placeholder={placeholder}/>
        </>
    );
}