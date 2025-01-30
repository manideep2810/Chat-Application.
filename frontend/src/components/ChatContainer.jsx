import React from 'react'
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from './skeletons/messageSkeleton';
import { formatMessageTime } from "../lib/utils";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);

  
    useEffect(() => {
      getMessages(selectedUser.id);
  
      subscribeToMessages();
  
      return () => unsubscribeFromMessages();
    }, [selectedUser.id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
      if (messageEndRef.current && messages) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);
    
  

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            {/* { console.log(authUser) } */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* {console.log("messages",messages)}
              {console.log("authUser",authUser)} */}
        {messages.map((message) => (
          
          
          <div
            key={message.id}
            
            className={`chat ${message.senderid == authUser.id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* {console.log("authUser",authUser)}
            {console.log("message",message)} */}
            
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderid == authUser.id
                      ? authUser.profilepic || "/avatar.png"
                      : selectedUser.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdat)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>

        ))}
      </div>

            <MessageInput />
        </div>
      
    )
}
