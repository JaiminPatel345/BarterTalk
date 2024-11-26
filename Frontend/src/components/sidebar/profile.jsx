import { useContext, useEffect, useState } from "react"
import AuthContext from "../../context/authContext"
import storeOrGetAvatar from "../../utils/avatar"
import Logout from "./logout"

const Profile = () => {
    const { user } = useContext(AuthContext)
    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        const getAvatar = async () => {
            let url = await storeOrGetAvatar(user.profileUrl, user._id)
            setAvatar(url)
        }
        getAvatar()
    }, [user])

    return (
        <div className="absolute mt-auto bottom-0 bg-gray-800 p-3 flex items-center gap-4 w-full">
            <div className="avatar ">
                <div className="     bg-[#EDDDD6] mask mask-squircle w-12">
                    <img src={avatar} alt="You" />
                </div>
            </div>
            <div className="text-md   text-gray-400">{user.username}</div>
            <div className="absolute right-5">
                <Logout />
            </div>
        </div>
    )
}

export default Profile
