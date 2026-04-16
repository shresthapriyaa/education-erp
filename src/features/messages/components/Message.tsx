"use client";

import { useEffect } from "react";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { MessageTable } from "@/features/messages/components/MessageTable";

export default function MessagesPage() {
  const {
    messages, loading, fetchMessages,
    sendMessage, editMessage, deleteMessage,
  } = useMessages();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async (values: { receiverId: string; content: string }) => {
    await sendMessage(values);
  };

  const handleEdit = async (id: string, values: { receiverId: string; content: string }) => {
    await editMessage(id, values);
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Send and manage messages between users.
        </p>
      </div>
      <MessageTable
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}