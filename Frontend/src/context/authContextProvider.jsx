/* eslint-disable react/prop-types */
import { useState } from "react"
import AuthContext from "./authContext"

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user-info")) || null
    )

    const setLogInUser = (user) => {
        const userInfo = {
            name: user.name,
            username: user.username,
        }
        localStorage.setItem("user-info", JSON.stringify(userInfo))
        setUser(userInfo)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                setLogInUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
