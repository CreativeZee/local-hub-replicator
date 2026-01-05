
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { jwtDecode } from 'jwt-decode';

const ConversationList = ({ onSelectConversation }: { onSelectConversation: (conversation: any) => void }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      setCurrentUser(decoded.user.id);
    }

    const fetchConversations = async () => {
      try {
        const response = await fetch(``${import.meta.env.VITE_BACKEND_URL}/conversations`, {
          headers: {
            'x-auth-token': localStorage.getItem('token') || '',
          },
        });
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants.find((p: any) => p._id !== currentUser);
        if (!otherParticipant) return null;

        return (
          <div
            key={conversation._id}
            className="p-4 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-center">
              <Avatar className="mr-4">
                <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/${otherParticipant.avatar}`} />
                <AvatarFallback>
                  {otherParticipant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{otherParticipant.name}</p>
                <p className="text-sm text-muted-foreground">{conversation.lastMessage?.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
