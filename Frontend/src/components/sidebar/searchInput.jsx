import { useContext, useState } from "react"
import UseConversation from "../../stores/useConversation"
import FlashMessageContext from "../../context/flashMessageContext"
import useGetConversations from "../../hooks/useGetConversation"

const SearchInput = () => {
    const [search, setSearch] = useState("")
    const { setSelectedConversation } = UseConversation()
    const { showErrorMessage, clearFlashMessage } =
        useContext(FlashMessageContext)
    const { conversations } = useGetConversations()
    const { filteredConversations, setFilteredConversations } =
        UseConversation()

    const handleSearch = (value) => {
        setSearch(value)

        if (value.trim() === "") {
            setFilteredConversations(conversations)
            return
        }

        const filtered = conversations.filter((c) =>
            c.name.toLowerCase().includes(value.toLowerCase())
        )

        setFilteredConversations(filtered)

        if (filtered.length === 0) {
            clearFlashMessage()
            showErrorMessage("No chat found with given name")
            setSelectedConversation(null)
        }
    }

    const handelSubmit = (e) => {
        // e.preventDefault()
        // if (search.trim() === "") return

        // if (search.length < 3) {
        //     showWarningMessage("Search must be at least 3 characters long")
        //     return
        // }

        // const conversation = conversations.find((c) =>
        //     c.name.toLowerCase().includes(search.toLocaleLowerCase())
        // )
        // if (conversation) {
        //     setSelectedConversation(conversation)
        // } else {
        //     showErrorMessage("No Chat found with given name")
        //     setSelectedConversation(null)
        // }
        e.preventDefault()
        if (search.trim() === "") return

        if (filteredConversations.length > 0) {
            setSelectedConversation(filteredConversations[0])
        }
    }

    return (
        <div>
            <form className="flex items-center gap-2" onSubmit={handelSubmit}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="input input-bordered rounded-full w-full"
                />
                <button
                    type="submit"
                    className="cursor-pointer bg-[#1D232A] p-3 rounded-full hover:bg-gray-700 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-search"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default SearchInput
