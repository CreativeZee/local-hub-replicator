
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { LeftSidebar } from '@/components/LeftSidebar';
import ConversationList from '@/components/ConversationList';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

  const handleMessageSent = () => {
    const currentConversation = selectedConversation;
    setSelectedConversation(null);
    setTimeout(() => {
      setSelectedConversation(currentConversation);
    }, 0);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar />
          <main className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Chat</h1>
            <div className="border rounded-lg h-[calc(100vh-200px)] flex">
              <div className="w-1/3 border-r">
                <ConversationList onSelectConversation={setSelectedConversation} />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6">
                  <MessageList conversationId={selectedConversation?._id} />
                </div>
                <div className="p-4 border-t">
                  <MessageInput conversation={selectedConversation} onMessageSent={handleMessageSent}/>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Chat;
