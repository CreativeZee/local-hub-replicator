
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MessageList = ({ conversationId }: { conversationId: string | null }) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        try {
          const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/conversations/${conversationId}/messages`, {
            headers: {
              'x-auth-token': localStorage.getItem('token') || '',
            },
          });
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [conversationId]);

  return (
    <div className="h-full overflow-y-auto">
      {messages.map((message) => (
        <div key={message._id} className="p-4 flex items-start">
          <Avatar className="mr-4">
            <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${message.from.avatar}`} />
            <AvatarFallback>{message.from.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{message.from.name}</p>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
