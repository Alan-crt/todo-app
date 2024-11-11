import React, { useState, useMemo, useCallback, useTransition } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Search, Filter, Check, MoreHorizontal } from 'lucide-react';
import { Task, Status, Priority } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTasksReorder: (startIndex: number, endIndex: number) => Promise<void>;
  onBulkUpdate: (taskIds: string[], updates: Partial<Task>) => Promise<void>;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  onTaskUpdate,
  onTasksReorder,
  onBulkUpdate,
  isLoading
}: TaskListProps) {
  // State management
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [isPending, startTransition] = useTransition();

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Drag and drop handlers
  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    try {
      await onTasksReorder(sourceIndex, destinationIndex);
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      window.showToast('Failed to reorder tasks', 'error');
    }
  }, [onTasksReorder]);

  // Bulk operations
  const handleSelectAll = useCallback(() => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
    }
  }, [filteredTasks, selectedTasks]);

  const handleTaskSelect = useCallback((taskId: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const handleBulkStatusUpdate = async (status: Status) => {
    try {
      await onBulkUpdate(Array.from(selectedTasks), { status });
      setSelectedTasks(new Set());
      window.showToast('Tasks updated successfully', 'success');
    } catch (error) {
      window.showToast('Failed to update tasks', 'error');
    }
  };

  const handleBulkPriorityUpdate = async (priority: Priority) => {
    try {
      await onBulkUpdate(Array.from(selectedTasks), { priority });
      setSelectedTasks(new Set());
      window.showToast('Tasks updated successfully', 'success');
    } catch (error) {
      window.showToast('Failed to update tasks', 'error');
    }
  };

  // Search handler with debounce
  const handleSearch = (value: string) => {
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
          <Dropdown
            trigger={
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            }
          >
            <div className="p-2 space-y-2">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
                  className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                >
                  <option value="ALL">All Statuses</option>
                  {Object.values(Status).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
                  className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                >
                  <option value="ALL">All Priorities</option>
                  {Object.values(Priority).map(priority => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Dropdown>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedTasks.size} selected
            </span>
            <Dropdown
              trigger={
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              }
            >
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                  Set Status
                </div>
                {Object.values(Status).map(status => (
                  <button
                    key={status}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleBulkStatusUpdate(status)}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                  Set Priority
                </div>
                {Object.values(Priority).map(priority => (
                  <button
                    key={priority}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleBulkPriorityUpdate(priority)}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </Dropdown>
          </div>
        )}
      </div>

      {/* Task List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {/* Select All Header */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="ml-3 text-sm text-gray-500">
                  {selectedTasks.size === filteredTasks.length
                    ? 'Deselect all'
                    : 'Select all'}
                </span>
              </div>

              {/* Tasks */}
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        p-4 bg-white rounded-lg border
                        ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}
                        ${selectedTasks.has(task.id) ? 'border-blue-500' : 'border-gray-200'}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => handleTaskSelect(task.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${task.priority === Priority.URGENT ? 'bg-red-100 text-red-800' :
                                task.priority === Priority.HIGH ? 'bg-orange-100 text-orange-800' :
                                task.priority === Priority.NORMAL ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {task.priority}
                            </span>
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              ${task.status === Status.DONE ? 'bg-green-100 text-green-800' :
                                task.status === Status.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                                task.status === Status.ARCHIVED ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'}
                            `}>
                              {task.status.replace('_', ' ')}
                            </span>
                            {task.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {filteredTasks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      )}
    </div>
  );
}