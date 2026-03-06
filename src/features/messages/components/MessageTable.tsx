"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Trash2, Send, Search } from "lucide-react";
import { MessageDialog } from "./MessageDialog";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Message } from "../types/message.types";

interface MessageTableProps {
  messages: Message[];
  onSend: (values: { receiverId: string; content: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const roleColor = (role: string) => {
  if (role === "ADMIN") return "default";
  if (role === "TEACHER") return "secondary";
  if (role === "STUDENT") return "outline";
  return "outline";
};

export function MessageTable({
  messages, onSend, onDelete, loading = false,
}: MessageTableProps) {
  const [search, setSearch] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = messages.filter(
    (m) =>
      (m.sender?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.receiver?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async (values: { receiverId: string; content: string }) => {
    setActionLoading(true);
    try {
      await onSend(values);
      setSendOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      await onDelete(selectedMessage.id);
      setDeleteOpen(false);
      setSelectedMessage(null);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by sender, receiver or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button
          className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
          onClick={() => setSendOpen(true)}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">From</TableHead>
              <TableHead className="text-black font-semibold">To</TableHead>
              <TableHead className="text-black font-semibold">Message</TableHead>
              <TableHead className="text-black font-semibold">Date</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-black text-sm">{message.sender?.username ?? "—"}</p>
                      <Badge variant={roleColor(message.sender?.role ?? "")} className="text-xs mt-0.5">
                        {message.sender?.role ?? "—"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-black text-sm">{message.receiver?.username ?? "—"}</p>
                      <Badge variant={roleColor(message.receiver?.role ?? "")} className="text-xs mt-0.5">
                        {message.receiver?.role ?? "—"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-black max-w-[300px] truncate">
                    {message.content}
                  </TableCell>
                  <TableCell className="text-sm text-black">{formatDate(message.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost" size="icon"
                      className="hover:bg-red-600 border border-gray-300 text-destructive"
                      onClick={() => { setSelectedMessage(message); setDeleteOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground text-sm">No messages found.</p>
        ) : (
          filtered.map((message) => (
            <div key={message.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">From:</span>
                    <p className="text-sm font-medium text-black">{message.sender?.username ?? "—"}</p>
                    <Badge variant={roleColor(message.sender?.role ?? "")} className="text-xs">
                      {message.sender?.role ?? "—"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">To:</span>
                    <p className="text-sm font-medium text-black">{message.receiver?.username ?? "—"}</p>
                    <Badge variant={roleColor(message.receiver?.role ?? "")} className="text-xs">
                      {message.receiver?.role ?? "—"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50 shrink-0"
                  onClick={() => { setSelectedMessage(message); setDeleteOpen(true); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-sm text-black line-clamp-2">{message.content}</p>
              <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
            </div>
          ))
        )}
      </div>

      <MessageDialog
        open={sendOpen}
        onOpenChange={setSendOpen}
        onSubmit={handleSend}
        loading={actionLoading}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}