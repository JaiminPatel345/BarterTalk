import { useContext, useEffect } from "react"
import MessageContainer from "../components/messageContainer/messageContainer"
import SideBar from "../components/sidebar/sideBar"
import AuthContext from "../context/authContext"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [])
    return (
        <>
            {user && (
                <div className="flex gap-3 divide-x h-screen w-screen rounded-lg px-2 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                    <SideBar />
                    <MessageContainer />
                </div>
            )}
        </>
    )
}

export default Home
