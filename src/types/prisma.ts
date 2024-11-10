import type { Prisma, Task as PrismaTask, List as PrismaList, User as PrismaUser } from '@prisma/client';

// Task related types
export type TaskCreateInput = Prisma.Args<typeof PrismaTask, 'create'>['data'];
export type TaskUpdateInput = Prisma.Args<typeof PrismaTask, 'update'>['data'];
export type TaskWhereInput = Prisma.Args<typeof PrismaTask, 'findFirst'>['where'];
export type TaskOrderByInput = Prisma.Args<typeof PrismaTask, 'findFirst'>['orderBy'];

// List related types
export type ListCreateInput = Prisma.Args<typeof PrismaList, 'create'>['data'];
export type ListUpdateInput = Prisma.Args<typeof PrismaList, 'update'>['data'];
export type ListWhereInput = Prisma.Args<typeof PrismaList, 'findFirst'>['where'];

// Define enums
export const Priority = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

export const Status = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  ARCHIVED: 'ARCHIVED'
} as const;

export const PermissionLevel = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  ADMIN: 'ADMIN'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];
export type Status = typeof Status[keyof typeof Status];
export type PermissionLevel = typeof PermissionLevel[keyof typeof PermissionLevel];

// Define base types that match your Prisma schema
export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: Priority;
  tags: string[];
  status: Status;
  position: number;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  name: string;
  ownerId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}