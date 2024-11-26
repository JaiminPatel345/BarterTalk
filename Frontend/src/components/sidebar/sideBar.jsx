import Conversations from "./conversations"
import SearchInput from "./searchInput"
import Profile from "./profile"
import UseConversation from "../../stores/useConversation"

const SideBar = () => {

    const {selectedConversation} = UseConversation()

    return (
        <div className={`h-full py-3 ${selectedConversation ? "hidden md:block" : "block"} `}>
            <SearchInput />
            <div className="divider "></div>
            <Conversations />
            <Profile />
        </div>
    )
}

export default SideBar
