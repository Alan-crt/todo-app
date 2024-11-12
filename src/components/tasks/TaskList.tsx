import React, { useState, useCallback } from 'react';
import { Plus, Template, Edit2, Copy, Trash2 } from 'lucide-react';
import { Task, Priority, Status } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';

// Type definitions for templates
interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  template: Partial<Task>;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskTemplatesProps {
  listId: string;
  onApplyTemplate: (template: Partial<Task>) => Promise<void>;
}

export function TaskTemplates({ listId, onApplyTemplate }: TaskTemplatesProps) {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter templates based on search query
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Template CRUD operations
  const handleCreateTemplate = async (templateData: Partial<Task>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/task-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateData.title,
          description: templateData.description,
          template: templateData,
        }),
      });

      if (!response.ok) throw new Error('Failed to create template');

      const newTemplate = await response.json();
      setTemplates(prev => [...prev, newTemplate]);
      setIsCreateModalOpen(false);
      window.showToast('Template created successfully', 'success');
    } catch (error) {
      window.showToast('Failed to create template', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = async (templateData: Partial<Task>) => {
    if (!selectedTemplate) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/task-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateData.title,
          description: templateData.description,
          template: templateData,
        }),
      });

      if (!response.ok) throw new Error('Failed to update template');

      const updatedTemplate = await response.json();
      setTemplates(prev => 
        prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t)
      );
      setIsEditModalOpen(false);
      window.showToast('Template updated successfully', 'success');
    } catch (error) {
      window.showToast('Failed to update template', 'error');
    } finally {
      setIsLoading(false);
      setSelectedTemplate(null);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/task-templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete template');

      setTemplates(prev => prev.filter(t => t.id !== templateId));
      window.showToast('Template deleted successfully', 'success');
    } catch (error) {
      window.showToast('Failed to delete template', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTemplate = async (template: TaskTemplate) => {
    try {
      await onApplyTemplate({
        ...template.template,
        listId,
      });
      window.showToast('Template applied successfully', 'success');
    } catch (error) {
      window.showToast('Failed to apply template', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Task Templates</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                {template.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {template.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsEditModalOpen(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleApplyTemplate(template)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {template.template.priority && (
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${template.template.priority === Priority.URGENT ? 'bg-red-100 text-red-800' :
                      template.template.priority === Priority.HIGH ? 'bg-orange-100 text-orange-800' :
                      template.template.priority === Priority.NORMAL ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {template.template.priority}
                  </span>
                )}
                {template.template.tags?.map(tag => (
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
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Template className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new template
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Task Template"
      >
        <TaskForm
          listId={listId}
          onSubmit={handleCreateTemplate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTemplate(null);
        }}
        title="Edit Task Template"
      >
        {selectedTemplate && (
          <TaskForm
            listId={listId}
            initialData={selectedTemplate.template}
            onSubmit={handleEditTemplate}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedTemplate(null);
            }}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
}