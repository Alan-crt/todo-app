import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useTaskTemplates } from '@/hooks/use-task-templates';
import { Priority, Status } from '@/types/task';

interface TaskTemplateManagerProps {
  onApplyTemplate: (template: TaskTemplate) => void;
}

export function TaskTemplateManager({ onApplyTemplate }: TaskTemplateManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { templates, isLoading, createTemplate, deleteTemplate } = useTaskTemplates();

  const handleCreateTemplate = async (data: FormData) => {
    const template = {
      name: data.get('name') as string,
      description: data.get('description') as string,
      title: data.get('title') as string,
      defaultPriority: data.get('priority') as Priority,
      defaultStatus: data.get('status') as Status,
      defaultTags: (data.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
    };

    await createTemplate(template);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Task Templates</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div
            key={template.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{template.name}</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApplyTemplate(template)}
                >
                  Use
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTemplate(template.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            {template.description && (
              <p className="mt-2 text-sm text-gray-500">{template.description}</p>
            )}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Priority:</span>
                <span>{template.defaultPriority}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Status:</span>
                <span>{template.defaultStatus}</span>
              </div>
              {template.defaultTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.defaultTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Task Template"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateTemplate(new FormData(e.currentTarget));
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Template Name</label>
              <Input name="name" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input name="description" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Title</label>
              <Input name="title" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Priority</label>
              <select name="priority" className="w-full rounded-md border-gray-300">
                {Object.values(Priority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Status</label>
              <select name="status" className="w-full rounded-md border-gray-300">
                {Object.values(Status).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Tags</label>
              <Input
                name="tags"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Template</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}