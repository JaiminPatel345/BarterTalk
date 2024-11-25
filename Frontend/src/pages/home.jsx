import { useContext, useEffect } from "react"
import MessageContainer from "../components/messageContainer/messageContainer"
import SideBar from "../components/sidebar/sideBar"
import AuthContext from "../context/authContext"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    },[])
    return (
        <>
            {user && (
                <div className="flex gap-3 divide-x  md:h-[550px] w-[80%] rounded-lg  bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                    <div className="h-full">
                        <SideBar />
                    </div>
                    <div className="w-full h-full">
                        <MessageContainer />
                    </div>
                </div>
            )}
        </>
    )
}

export default Home
