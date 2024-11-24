/* eslint-disable react/prop-types */
import { useState } from "react"
import AuthContext  from "./authContext"

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user-info")) || null
    )

    const setLogInUser = (user) => {
        localStorage.setItem("user-info", JSON.stringify(user))
        setUser(user)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setLogInUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
