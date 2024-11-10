// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth/jwt';
import { z } from 'zod';
import type { TaskWhereInput, Priority, Status, TaskCreateInput } from '@/types/prisma';


// Input validation schema
const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const),
  tags: z.array(z.string()),
  listId: z.string(),
  position: z.number().int().positive(),
});

// Get tasks with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const tag = searchParams.get('tag');

    // Build query filters with proper typing
    const filters: TaskWhereInput = {
      OR: [
        {
          list: {
            ownerId: payload.userId
          }
        },
        {
          list: {
            sharedWith: {
              some: {
                userId: payload.userId
              }
            }
          }
        }
      ]
    };

    // Add optional filters
    if (listId) {
      filters.listId = listId;
    }

    if (status) {
      filters.status = status as Status;
    }

    if (priority) {
      filters.priority = priority as Priority;
    }

    if (tag) {
      filters.tags = {
        has: tag
      };
    }

    // Fetch tasks with filters
    const tasks = await prisma.task.findMany({
      where: filters,
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        list: {
          select: {
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new task
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const createData: TaskCreateInput = {
      title: validatedData.title,
      description: validatedData.description,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      priority: validatedData.priority,
      status: 'TODO',
      tags: validatedData.tags,
      position: validatedData.position,
      list: {
        connect: {
          id: validatedData.listId
        }
      }
    };

    // Verify list access with proper typing
    const list = await prisma.list.findFirst({
      where: {
        id: validatedData.listId,
        OR: [
          { ownerId: payload.userId },
          {
            sharedWith: {
              some: {
                userId: payload.userId,
                permissionLevel: {
                  in: ['EDIT', 'ADMIN']
                }
              }
            }
          }
        ]
      }
    });

    if (!list) {
      return NextResponse.json(
        { error: 'List not found or insufficient permissions' },
        { status: 403 }
      );
    }

    // Create task with proper typing
    const task = await prisma.task.create({
      data: createData,
      include: {
        list: {
          select: {
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}