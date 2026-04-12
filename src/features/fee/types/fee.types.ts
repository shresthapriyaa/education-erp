// export interface Fee {
//   id: string;
//   studentId: string;
//   amount: number;
//   dueDate: string;
//   paid: boolean;
//   student?: {
//     id: string;
//     username: string;
//     email: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }




export type FeeStatus = "PENDING" | "PAID" | "OVERDUE" | "WAIVED";

export interface Fee {
  id:        string;
  studentId: string;
  amount:    number;
  dueDate:   string;
  paidDate?: string | null;
  status:    FeeStatus;
  remarks?:  string | null;
  student?: {
    id:       string;
    username: string;
    email:    string;
  };
  createdAt: string;
  updatedAt: string;
}