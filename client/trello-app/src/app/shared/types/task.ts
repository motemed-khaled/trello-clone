export interface Task {
  _id: string;
  title: string;
  description?: string;
  boardId: string;
  userId: string;
  columId: string;
  createdAt: string;
  updatedAt: string;
}
