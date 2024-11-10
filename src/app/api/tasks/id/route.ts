// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth/jwt';
import { z } from 'zod';

// Input validation schema
const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  tags: z.array(z.string()).optional(),
  position: z.number().int().positive().optional(),
});

// Helper function to verify task access
async function verifyTaskAccess(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      list: {
        OR: [
          { ownerId: userId },
          { sharedWith: { some: { 
            userId: userId,
            permissionLevel: { in: ['EDIT', 'ADMIN'] }
          }}}
        ]
      }
    },
    include: {
      list: {
        select: {
          ownerId: true,
          sharedWith: {
            select: {
              userId: true,
              permissionLevel: true
            }
          }
        }
      }
    }
  });

  return task;
}

// Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify task access
    const task = await verifyTaskAccess(params.id, payload.userId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        updatedAt: new Date(),
      },
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

    return NextResponse.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify task access
    const task = await verifyTaskAccess(params.id, payload.userId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or insufficient permissions' },
        { status: 403 }
      );
    }

    // Delete task
    await prisma.task.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper route to update task position
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify task access
    const task = await verifyTaskAccess(params.id, payload.userId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const { newPosition } = await request.json();
    if (typeof newPosition !== 'number' || newPosition < 1) {
      return NextResponse.json(
        { error: 'Invalid position' },
        { status: 400 }
      );
    }

    // Update positions in transaction
    await prisma.$transaction(async (tx) => {
      // Move other tasks out of the way
      await tx.task.updateMany({
        where: {
          listId: task.list.ownerId,
          position: {
            gte: newPosition
          },
          id: {
            not: params.id
          }
        },
        data: {
          position: {
            increment: 1
          }
        }
      });

      // Update task position
      await tx.task.update({
        where: { id: params.id },
        data: { position: newPosition }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task position:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}