
import Conversation from './conversion';
import useGetConversations from '../../hooks/useGetConversation';
import {ScaleLoader} from 'react-spinners';

const Conversations = () => {
  const { conversations , loading } = useGetConversations()

  
  if(loading){
    return(
      <div className='flex justify-center items-center'>
        <ScaleLoader color='#fff'/>
      </div>
    )
  }
  
  return (
      <div className="flex flex-col gap-3">
          {conversations.map((conversation, idx) => (
              <Conversation
              key={conversation._id}
              conversation={conversation}
              lastIndex={idx == conversations.length - 1}

              />
          ))}
      </div>
  )
}

export default Conversations