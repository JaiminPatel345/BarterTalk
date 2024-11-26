
import Conversation from './conversion';
import useGetConversations from '../../hooks/useGetConversation';
import {ScaleLoader} from 'react-spinners';
import UseConversation from '../../stores/useConversation';

const Conversations = () => {
  const {  loading } = useGetConversations()
  const {filteredConversations} = UseConversation()

  
  if(loading){
    return(
      <div className='flex justify-center items-center'>
        <ScaleLoader color='#fff'/>
      </div>
    )
  }
  
  return (
      <div className="flex flex-col gap-3 overflow-auto h-[70%]">
          {filteredConversations?.map((conversation, idx) => (
              <Conversation
                  key={conversation._id}
                  conversation={conversation}
                  lastIndex={idx == filteredConversations.length - 1}
              />
          ))}
      </div>
  )
}

export default Conversations