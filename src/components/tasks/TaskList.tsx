'use client';

import React from 'react';
import { Task, Status } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { Clock, AlertTriangle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: Status) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function TaskList({ tasks, onTaskClick, onStatusChange, onReorder }: TaskListProps) {
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const taskElement = e.currentTarget as HTMLDivElement;
    const bounding = taskElement.getBoundingClientRect();
    const mouseY = e.clientY;
    const thresholdY = bounding.top + bounding.height / 2;

    taskElement.style.transform = mouseY < thresholdY 
      ? 'translateY(-2px)'
      : 'translateY(2px)';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const taskElement = e.currentTarget as HTMLDivElement;
    taskElement.style.transform = '';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const taskElement = e.currentTarget as HTMLDivElement;
    taskElement.style.transform = '';

    if (draggedTask) {
      const sourceIndex = tasks.findIndex(task => task.id === draggedTask.id);
      if (sourceIndex !== targetIndex) {
        onReorder(sourceIndex, targetIndex);
      }
    }
    setDraggedTask(null);
  };

  const getPriorityColor = (task: Task) => {
    switch (task.priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'NORMAL': return 'text-blue-600';
      case 'LOW': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== Status.DONE;
  };

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => handleDragStart(task)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          className="relative group bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onTaskClick(task)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium ${task.status === Status.DONE ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isOverdue(task) && (
                <AlertTriangle className="text-red-500 w-5 h-5" />
              )}
              <select
                value={task.status}
                onChange={(e) => {
                  e.stopPropagation();
                  onStatusChange(task.id, e.target.value as Status);
                }}
                className="text-sm border rounded px-2 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                {Object.values(Status).map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-4 text-sm">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue(task) ? 'text-red-600' : 'text-gray-500'}`}>
                <Clock className="w-4 h-4" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            <div className={`flex items-center gap-1 ${getPriorityColor(task)}`}>
              {task.priority}
            </div>
            <div className="flex flex-wrap gap-1">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}