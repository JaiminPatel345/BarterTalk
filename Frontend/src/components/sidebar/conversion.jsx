const Conversation = () => {
    return (
        <>
            <div className="flex justify-center items-center gap-2 p-3">
                <div className="avatar online w-12 rounded-full">
                    <div>
                        <img
                            src="https://avatar.iran.liara.run/public/boy"
                            className=""
                            alt="user avatar"
                        />
                    </div>
                </div>
                <div className="flex flex-1">
                    <div>
                        <p className="font-bold text-gray-200 ">
                            Jaimin Detroja
                        </p>
                    </div>
                </div>
            </div>
            <div className="divider my-0 py-0 h-1"></div>
        </>
    )
}

export default Conversation
