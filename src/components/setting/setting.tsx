import React,{useState, useEffect} from "react";
import { FaArrowLeft, FaPen, FaRegMoon, FaLightbulb, } from "react-icons/fa6";
import { FaTimes,FaCamera,FaUser } from "react-icons/fa";
import { LuBan } from "react-icons/lu"; 
import { auth, db } from "../../firebase/config"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import Logout from '../logout/logout'
import Input from "../input";
import Loadding from "../loadding";



type SettingProps={
    setIsShowSetting:React.Dispatch<React.SetStateAction<boolean>>
    isShowSetting:boolean;
    setIsRefresh:React.Dispatch<React.SetStateAction<boolean>>;
    isRefresh:boolean;
    isHideEmail:string;
    theme:string
}
type User = {
    id:string;
    userName:string;
    email:string;
    password:string
    image:''
}

export default function Setting({setIsShowSetting, isShowSetting,setIsRefresh,isRefresh,isHideEmail,theme}:SettingProps){
    const collectionRefUser = collection(db,'users');
    const [editName, setEditName] = useState<string>('');
    const [isUpdating, setIsUpdating]= useState<boolean>(false)
    const [userData, setUserData] = useState<User>({
        id:'',
        userName:'',
        email:'',
        password:'',
        image:''
    })
    const [isAddPic, setIsAddPic]= useState<boolean>(false)
    const [image, setImage] = useState<File | null>(null);

    useEffect(()=>{
        const fetchUser =async ()=>{
            try{
                const quarySnapshot = await getDocs(collectionRefUser);
                quarySnapshot.forEach((user)=>{
                    const data = user.data()
                    if(data.email === auth.currentUser?.email ){
                        setUserData({
                            id:user.id,
                            userName:data.userName,
                            email:data.email,
                            password : data.password,
                            image:data.image
                        })
                    }
                })
            }catch(err){
                console.log(err)
            }
        }
        fetchUser()
    },[isRefresh]);

    const hideEmailHandler = ()=>{
        const isHide:string|null = localStorage.getItem('isHideEmail')
        
        if(isHide===null){
            localStorage.setItem('isHideEmail','true')
        }
        else if(isHide === 'true'){
            localStorage.setItem('isHideEmail','false')
        }
        else if(isHide === 'false'){
            localStorage.setItem('isHideEmail','true')
        }
        setIsRefresh(!isRefresh)
    }

    const changeThemeHandler = ()=>{
        console.log(localStorage.getItem('themeOfTaskRemainder'))
        try{
            const theme1 = localStorage.getItem('themeOfTaskRemainder');
        if(theme1===null){
            localStorage.setItem('themeOfTaskRemainder','dark')
        }else if(theme1==='light'){
            localStorage.setItem('themeOfTaskRemainder','dark')
        }else if(theme1==='dark'){
            localStorage.setItem('themeOfTaskRemainder','light')
        }
        }catch(err){
            console.log('set theme error')
        }
        setIsRefresh(!isRefresh)
    }

    const updateNameHandler =async ()=>{
        try{
            await updateDoc(doc(db,'users',userData.id),{
                userName:editName
            })
            setIsRefresh(true)
            setIsUpdating(false)
        }catch(err){

        }
    }

    const uploadeImage = async(e)=>{
        e.preventDefault()
        setIsAddPic(true)
        const formData = new FormData();
        
        if (image) {
            formData.append('file', image);
        } else {
            console.error('No image selected');
        }
        
        try{
            formData.append('upload_preset','react-upload')
            console.log(formData.get('upload_preset'))
            console.log(formData.get('file'))
            const response = await fetch('https://api.cloudinary.com/v1_1/yztgqckd/image/upload',{
                method:'POST',
                body:formData
            })
            const data = await response.json();
            await updateDoc(doc(db,'users',userData.id),{
                image:data.secure_url
            })
            setUserData({
                ...userData,
                image:data.secure_url
            })
            setIsAddPic(false)
            setImage(null)
            setIsRefresh(true)
        }catch(err){

        }
    }

    return(
        <div className={`w-[300px] h-screen
            text-white  
            absolute 
            top-0
            left-0
            max-[768px]:w-[300px]  
            py-4  z-50  
            transition-transform 
            duration-500 
            ease-in-out 
            border-r-1
            border-gray-500
            ${(isShowSetting) ? 'translate-x-0' : '-translate-x-full'}
            ${theme==='dark'? 'bg-gray-700 ':'bg-gray-300 ' }
            `
        } >
            <FaArrowLeft 
                onClick={()=>setIsShowSetting(false)} 
                className={`text-xl  cursor-pointer hover:text-gray-500 z-100  m-2 ${theme==='light' && 'text-black'}`}
            />
            <div className={`p-4 ${theme==='light' && 'text-black'} `}>
                <div className=" relative  w-fit"  >
                    {userData.image && <img src={userData.image} alt="" className="w-[80px] h-[80px] bg-blue-200 rounded-full  " />}
                    {!userData.image && <FaUser  className="w-[80px] h-[80px] bg-gray-500 rounded-full  " />}
                    
                    <>
                        <label htmlFor="imageInput" className={`absolute right-0 bottom-1 bg-gray-800 rounded-full p-1 ${theme==='dark' ? 'bg-gray-800 text-white ':'bg-gray-800 text-white'}`}> <FaCamera/> </label>
                        <input 
                            id="imageInput"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }} 
                            type="file" 
                            hidden
                            
                        />
                    </>
                
                </div>
                <div className="flex ">
                    {
                        image!==null && <button onClick={(e)=>uploadeImage(e) } className={`flex justify-center items-center gap-4 bg-blue-600 text-white font-bold w-[47%] ml-[2%] mr-[1%] my-3 py-2 rounded-lg shadow-xl/30 hover:bg-blue-500 cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 `} > 
                            {isAddPic? <Loadding style1="w-[20px] h-[20px] " style2="bg-blue-600" /> :"upload image"} 
                        </button>
                    }
                    {image!==null && <button onClick={(e)=>setImage(null) } className={`flex justify-center items-center gap-4 bg-red-600 text-white font-bold w-[47%] ml-[1%] mr-[2%] my-3 py-2 rounded-lg shadow-xl/30 hover:bg-red-500 cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 `} disabled={isAddPic}>Cancel</button>}
                </div>
                <div className="flex items-center gap-3 py-2 text-xl  ">
                    {userData.userName || <Loadding style1=" w-[20px] h-[20px] "style2={` ${theme==='dark' ? 'bg-gray-600': 'bg-gray-300'} `}  /> } 
                    {!isUpdating&& <FaPen onClick={()=>setIsUpdating(true)} className="text-lg text-yellow-400 hover:text-yellow-600 cursor-pointer "/> }
                    {isUpdating&& <FaTimes onClick={()=>setIsUpdating(false)} className="text-lg text-yellow-400 hover:text-yellow-600 cursor-pointer "/> }
                </div>
                {
                    isUpdating && 
                    <div className="flex items-center gap-2 ">
                        <Input 
                            label=""
                            type="text"
                            className={` my-2 p-2 rounded-2xl   focus:outline-none focus:ring-2 focus:ring-blue-500  ${theme==='dark'? 'bg-gray-600 text-white':'bg-gray-400 text-black' } `} 
                            placeholder="Enter new name..."
                            onChange={(e)=> setEditName(e.target.value) }
                        />
                        <button 
                            className={`${theme==='dark'? "bg-gray-600 hover:bg-gray-500":" bg-gray-400 hover:bg-gray-500" } p-2 rounded-full cursor-pointer`}
                            onClick={updateNameHandler}
                            disabled={editName.trim().length===0}
                        > 
                            update 
                        </button>
                    </div>
                }
                
                <p className="text-sm ">{userData.email}</p>
            </div>
            <Logout />
            <hr />
            <div onClick={changeThemeHandler} className={`flex items-center gap-2 p-2 my-2  cursor-pointer ${theme==='light' ? 'text-black hover:bg-gray-400 ' : "hover:bg-gray-600"}`}  >
                { theme==='light'? <FaRegMoon />: <FaLightbulb />}
                Dark mode
            </div>
            <hr />
            <div onClick={hideEmailHandler} className={`flex items-center gap-2 p-2 my-2  cursor-pointer ${theme==='light' ? 'text-black hover:bg-gray-400 ' : "hover:bg-gray-600"}`}>
                <LuBan />
                {isHideEmail==='true'? "Show email" :"Hide email"}
            </div>
        </div>    
    );
}
