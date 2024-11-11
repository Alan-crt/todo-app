import { useState, useCallback } from 'react';
import { TaskTemplate } from '@/types/task-template';
import { useToast } from '@/components/ui/toast-context';

export function useTaskTemplates() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/task-templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createTemplate = useCallback(async (template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/task-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error('Failed to create template');
      const data = await response.json();
      setTemplates(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/task-templates/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete template');
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return {
    templates,
    isLoading,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
  };
}