export enum Priority {
    LOW = 'LOW',
    NORMAL = 'NORMAL',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
  }
  
  export enum Status {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED'
  }
  
  export interface Task {
    id: string;
    title: string;
    description?: string | null;
    dueDate?: Date | null;
    priority: Priority;
    tags: string[];
    status: Status;
    position: number;
    listId: string;
    createdAt: Date;
    updatedAt: Date;
    list?: {
      name: string;
      owner: {
        id: string;
        name: string | null;
        email: string;
      };
    };
  }
  
  // Partial type for task creation/updates
  export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'list'>;