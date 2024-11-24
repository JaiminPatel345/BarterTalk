import Conversations from "./conversations"
import SearchInput from "./searchInput"
import Logout from './logout';

const SideBar = () => {
  return (
      <div className="py-3 h-full ">
          <SearchInput />
          <div className="divider "></div>
          <div className="overflow-y-auto h-[350px]">
              <Conversations />
          </div>
          <div className="absolute bottom-5 left-3">
              <Logout />
          </div>
      </div>
  )
}

export default SideBar