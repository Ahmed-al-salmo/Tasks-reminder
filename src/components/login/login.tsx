import React,{useState, useEffect} from "react";
import Input from "../input";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "../errorNotification";
import Loadding from "../loadding";

type loginInputs ={
    email: string;
    password: string;

}

type LoginInputsFields ={
    label: string;
    type: string;
    className:string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    placeholder: string;
}[]
type LogInProps ={
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
    theme:string
}

export default function Login({setIsLogin,theme}: LogInProps) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] =useState<loginInputs>({
        email: "",
        password: ""
    })
    const [isLogingInLoading, setIsLogingInLoading] = useState<boolean>(false);
    const [errorData, setErrorData] = useState<{isError:boolean, errorMessage:string}>({
        isError:false,
        errorMessage:''
    })

    const loginInputsFields:LoginInputsFields =[
        {
            label: "Email",
            type: "email",
            className:'w-full bg-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none ',
            onChange: (e) => {
                setInputValue({...inputValue,email:e.target.value});
            },
            placeholder:'xxx@gmail.com'
        },
        {
            label: "Password",
            type: "password",
            className:'w-full bg-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none ',
            onChange: (e) => {
                setInputValue({...inputValue,password:e.target.value});
            },
            placeholder:'********'
        }
    ]

    const loginTestInput = ()=>{
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
        return true
    }

    const handleLogin = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLogingInLoading(true);

        if(loginTestInput()){
            try {
                const userCredential = await signInWithEmailAndPassword(auth, inputValue.email, inputValue.password);
                const user = userCredential.user;
                console.log('Logged in user:', user);
                navigate('/home');
                setIsLogingInLoading(false)
            } catch (error) {
                setErrorData({
                    isError:true,
                    errorMessage:'Log in Failed please try again ....'
                });
                
                setIsLogingInLoading(false)
            }
        }else{
            setIsLogingInLoading(false)
        }
    }


    return(
        <form className={` w-[450px]  p-4  rounded-lg border-2 border-black shadow-xl/40 max-[500px]:w-[90%] ${theme==='dark' ? 'bg-gray-600  shadow-white': 'bg-gray-200' }`}  >
            {errorData.isError && <ErrorNotification errorMessage={errorData.errorMessage} setErrorData={setErrorData} />}
            <div className="w-[100px] h-[100px] bg-green-200 m-auto border-1 border-black mb-[50px] mt-[25px]" ></div>
            {
                loginInputsFields.map((input,index) => (
                    <Input theme={theme} onChange={input.onChange} key={index} label={input.label} type={input.type} className={input.className} placeholder={input.placeholder}/>
                ))
            }
            <hr className="text-gray-500 my-2"/>
            <button disabled={isLogingInLoading} onClick={(e)=>handleLogin(e)} className="flex justify-center items-center gap-4 border-none w-full bg-blue-600 text-white p-2 rounded-md mb-2 focus:border-2 focus:border-black outline-none mt-3 hover:bg-blue-800 hover:cursor-pointer text-xl font-bold" type="submit">
                {isLogingInLoading&& <Loadding style1="w-[20px] h-[20px]" style2={`bg-blue-500`}/>}
                {isLogingInLoading? "Logging ...":"Log in" } 
            </button>
            <p className=" text-sm text-center" >you don`t have account? 
                <span onClick={()=>setIsLogin(false)}  className="text-blue-600 mx-2 text-lg hover:text-blue-800 cursor-pointer">create account</span>
            </p>
        </form>
    )
}