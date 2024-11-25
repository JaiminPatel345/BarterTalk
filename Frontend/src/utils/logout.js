import UseConversation from "../stores/useConversation"

const LogoutUser = () => {
    localStorage.removeItem("user-info")
    

}

export default LogoutUser