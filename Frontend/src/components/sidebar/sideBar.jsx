import Conversations from "./conversations"
import SearchInput from "./searchInput"
import Logout from "./logout"
import Profile from "./profile"

const SideBar = () => {
    return (
        <div className="relative py-3 ">
            <SearchInput />
            <div className="divider "></div>
            <Conversations />
            <Profile />
        </div>
    )
}

export default SideBar
