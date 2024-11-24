const MessageInput = () => {
    return (
        <form className=" bottom-4 px-4 my-3 ">
            <div className=" flex gap-5  w-full">
                <input
                    type="text"
                    className="border text-sm rounded-lg block w-full p-2.5  bg-[#24140e] border-[#be694a] text-white"
                    placeholder="Send a message"
                />
                <button
                    type="submit"
                    className=" inset-y-0 end-0 flex items-center pe-3"
                >
                    <div className="text-[#FF5317]">
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
                            className=""
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                        </svg>
                    </div>
                </button>
            </div>
        </form>
    )
}
export default MessageInput
