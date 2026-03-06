export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sender?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  receiver?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}