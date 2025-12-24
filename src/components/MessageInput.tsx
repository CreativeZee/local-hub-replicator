
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { jwtDecode } from 'jwt-decode';

const MessageInput = ({ conversation, onMessageSent }: { conversation: any | null, onMessageSent: () => void }) => {
  const [text, setText] = useState('');
  const [recipientId, setRecipientId] = useState<string | null>(null);

  useEffect(() => {
    if (conversation) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        const currentUser = decoded.user.id;
        const recipient = conversation.participants.find((p: any) => p._id !== currentUser);
        if (recipient) {
          setRecipientId(recipient._id);
        }
      }
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (text.trim() && recipientId) {
      try {
        await fetch(`/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || '',
          },
          body: JSON.stringify({ to: recipientId, text }),
        });
        setText('');
        onMessageSent();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex gap-3">
      <Input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
};

export default MessageInput;
