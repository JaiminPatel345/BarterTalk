import { useEffect, useRef } from "react";
import Message from "./message";
import UseConversation from "../../stores/useConversation";
import useGetMessages from "../../hooks/useGetMessages";
import { ScaleLoader } from "react-spinners";

const Messages = () => {
  const { messages, selectedConversation } = UseConversation();
  const { getMessage, loading } = useGetMessages();
  const lastMsgRef = useRef();

  useEffect(() => {
    getMessage();
  }, [selectedConversation]);

  useEffect(() => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  });

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center">
          <ScaleLoader color="#fff" />
        </div>
      ) : (
        <div className="px-4   overflow-y-scoll ">
          {messages.length === 0 ? (
            <div>
              <p className="text-gray-400 text-center">No messages yet</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMsgRef : null}
              >
                <Message message={message} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default Messages;
