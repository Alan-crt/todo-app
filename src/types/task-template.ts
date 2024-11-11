export interface TaskTemplate {
    id: string;
    name: string;
    description?: string;
    title: string;
    defaultPriority: Priority;
    defaultStatus: Status;
    defaultTags: string[];
    createdAt: Date;
    updatedAt: Date;
  }