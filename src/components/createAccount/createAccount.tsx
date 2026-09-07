import React,{useState, useEffect} from "react";
import Input from "../input";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import ErrorNotification from "../errorNotification";
import Loadding from "../loadding";

type createAccountInputs ={
    label: string;
    type: string;
    className:string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder:string
}[]
type createAccountInputsValues = {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
type CreateAccountProps ={
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
    theme:string
}

export default function CreateAccount({setIsLogin,theme}: CreateAccountProps) {
    const collectionRef = collection(db, "users");
    const navigate = useNavigate();
    const [inputValue, setInputValue] =useState< createAccountInputsValues>({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errorData, setErrorData] = useState<{isError:boolean, errorMessage:string}>({
        isError:false,
        errorMessage:''
    })
    const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);
    const createAccountInputsValus:createAccountInputs =[
        {
            label: "Username",
            type: "text",
            className:'w-full bg-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none ',
            onChange: (e) => {
                setInputValue({...inputValue,userName:e.target.value});
            },
            placeholder: "Ah***"
        },
        {
            label: "Email",
            type: "email",
            className:'w-full bg-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none ',
            onChange: (e) => {
                setInputValue({...inputValue,email:e.target.value});
            },
            placeholder: "xxx@gmail.com"
        },
        {
            label: "Password",
            type: "password",
            className:'w-full bg-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none ',
            onChange: (e) => {
                setInputValue({...inputValue,password:e.target.value});
            },
            placeholder: "********"
        },
        {
            label: "Confirm Password",
            type: "password",
            className:'w-full bg-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none ',
            onChange: (e) => {
                setInputValue({...inputValue,confirmPassword:e.target.value});
            },
            placeholder: "********"
        }
    ]

    // حفظ الجلسة 
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/home');
            }
        });
    
        return () => unsubscribe();
    },[])

    const inputTestingValue = ():boolean => {

        if(inputValue.userName.length <4){
            setErrorData({
                isError:true,
                errorMessage:'Your name must be more then 4 latters ... '
            })
            return false
        }
        
        if(inputValue.email.length === 0){
            setErrorData({
                isError:true,
                errorMessage:'Input correct email ... '
            })
            return false
        }
        if( !isNaN(parseInt(inputValue.email.charAt(0))) ){
            setErrorData({
                isError:true,
                errorMessage:'Your email must start with a Letter ... '
            })
            return false
        }
        if( inputValue.password.length < 8){
            setErrorData({
                isError:true,
                errorMessage:'Your Password length must be bigger or equal 8 char ...'
            })
            return false
        }
        if( inputValue.password !== inputValue.confirmPassword){
            setErrorData({
                isError:true,
                errorMessage:'Your confirm Password and password must equal...'
            })
            return false
        }
        if( !isNaN(parseInt(inputValue.userName.charAt(0)))){
            setErrorData({
                isError:true,
                errorMessage:'Your Name must start with a letter...'
            })
            return false
        }
        return true;
        // return inputValue.userName.length > 0 && 
        //     inputValue.email.length > 0 && 
        //     inputValue.password.length >= 8 && 
        //     inputValue.confirmPassword.length >= 8 && 
        //     inputValue.password === inputValue.confirmPassword &&
        //     // console.log( parseInt(inputValue.userName.charAt(0)))
        //     isNaN(parseInt(inputValue.userName.charAt(0)))&&
        //     isNaN(parseInt(inputValue.email.charAt(0))) ;
    }
    const createAccountHandler = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsCreatingAccount(true);
        if(inputTestingValue()){
            try{
                await createUserWithEmailAndPassword(auth, inputValue.email, inputValue.password);
                console.log("Account created successfully");
                setIsCreatingAccount(false);
                await addDoc(collectionRef, {
                    userName: inputValue.userName,
                    email: inputValue.email,
                    password: inputValue.password,
                    image:''
                });
                navigate('/home')
            }catch(error){
                setErrorData({
                    isError:true,
                    errorMessage:'Create Account failed please try again ... '
                })
                setIsCreatingAccount(false);
            }
        }else{
            setIsCreatingAccount(false);
        }
    }

    return(
        <form className={` w-[450px]  p-4  rounded-lg border-2 border-black shadow-xl/40 max-[500px]:w-[90%] ${theme==='dark' ? 'bg-gray-600  shadow-white': 'bg-gray-200' }`} >
            {errorData.isError && <ErrorNotification errorMessage={errorData.errorMessage} setErrorData={setErrorData} />}
            <div className="w-[100px] h-[100px] bg-green-200 m-auto border-1 border-black mb-[50px] mt-[25px]" ></div>
            {
                createAccountInputsValus.map((input, index) => {
                    return(
                        <Input theme={theme} onChange={input.onChange} key={index} label={input.label} type={input.type} className={input.className} placeholder={input.placeholder}/>
                    )
                })
            }
            <hr className="text-gray-400 my-2"/>
            <button disabled={isCreatingAccount} onClick={(e)=>createAccountHandler(e)} className=" flex justify-center items-center gap-4 border-none w-full bg-blue-600 text-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none mt-3 hover:bg-blue-800 hover:cursor-pointer text-xl font-bold " type="submit">
                { isCreatingAccount&& <Loadding style1="w-[20px] h-[20px]" style2={`bg-blue-500`}/>}
                {isCreatingAccount? "Creating...":"Create Account"}
            </button>
            <p className={`text-sm text-center ${theme==='dark' && 'text-white' }`} >you already have account? 
                <span onClick={()=>setIsLogin(true)} className="text-blue-600 mx-2 text-lg hover:text-blue-800 cursor-pointer">login</span>
            </p>
        </form>
    );
}