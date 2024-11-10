// src/hooks/use-lists.ts

import { useState, useEffect, useCallback } from 'react';
import { List, ListWithChildren, ListWithSharing, PermissionLevel } from '@/types/list';
import { useToast } from '@/components/ui/toast-context';
import { useSocket } from '@/hooks/socket-context';

interface UseListsOptions {
  includeShared?: boolean;
  parentId?: string | null;
}

interface UseListsReturn {
  lists: ListWithChildren[];
  sharedLists: ListWithSharing[];
  isLoading: boolean;
  error: Error | null;
  createList: (data: { name: string; parentId?: string }) => Promise<List>;
  updateList: (id: string, data: { name: string }) => Promise<List>;
  deleteList: (id: string) => Promise<void>;
  shareList: (listId: string, email: string, permissionLevel: PermissionLevel) => Promise<void>;
  removeShare: (listId: string, userId: string) => Promise<void>;
  reorderLists: (listId: string, newParentId: string | null) => Promise<void>;
}

export function useLists({ includeShared = false, parentId = null }: UseListsOptions = {}): UseListsReturn {
  const [lists, setLists] = useState<ListWithChildren[]>([]);
  const [sharedLists, setSharedLists] = useState<ListWithSharing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const socket = useSocket();

  // Fetch lists
  const fetchLists = useCallback(async () => {
    try {
      const response = await fetch(`/api/lists?includeShared=${includeShared}&parentId=${parentId || ''}`);
      if (!response.ok) throw new Error('Failed to fetch lists');
      
      const data = await response.json();
      setLists(data.lists);
      if (includeShared) {
        setSharedLists(data.sharedLists);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch lists'));
      toast({
        title: 'Error',
        description: 'Failed to fetch lists',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [includeShared, parentId, toast]);

  // Create list
  const createList = async (data: { name: string; parentId?: string }): Promise<List> => {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create list');
      
      const newList = await response.json();
      await fetchLists(); // Refresh lists to get updated hierarchy
      
      toast({
        title: 'Success',
        description: 'List created successfully',
      });

      // Emit socket event for real-time updates
      socket?.emit('list:create', newList);
      
      return newList;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create list');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update list
  const updateList = async (id: string, data: { name: string }): Promise<List> => {
    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update list');
      
      const updatedList = await response.json();
      await fetchLists(); // Refresh lists
      
      toast({
        title: 'Success',
        description: 'List updated successfully',
      });

      socket?.emit('list:update', updatedList);
      
      return updatedList;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update list');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete list
  const deleteList = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/lists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete list');
      
      await fetchLists(); // Refresh lists
      
      toast({
        title: 'Success',
        description: 'List deleted successfully',
      });

      socket?.emit('list:delete', { id });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete list');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Share list
  const shareList = async (listId: string, email: string, permissionLevel: PermissionLevel): Promise<void> => {
    try {
      const response = await fetch(`/api/lists/${listId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, permissionLevel }),
      });

      if (!response.ok) throw new Error('Failed to share list');
      
      await fetchLists(); // Refresh lists to get updated sharing info
      
      toast({
        title: 'Success',
        description: 'List shared successfully',
      });

      socket?.emit('list:share', { listId, email, permissionLevel });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to share list');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Remove share
  const removeShare = async (listId: string, userId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/lists/${listId}/share/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove share');
      
      await fetchLists(); // Refresh lists
      
      toast({
        title: 'Success',
        description: 'Share removed successfully',
      });

      socket?.emit('list:unshare', { listId, userId });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove share');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Reorder lists (change parent)
  const reorderLists = async (listId: string, newParentId: string | null): Promise<void> => {
    try {
      const response = await fetch(`/api/lists/${listId}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: newParentId }),
      });

      if (!response.ok) throw new Error('Failed to reorder list');
      
      await fetchLists(); // Refresh lists to get updated hierarchy
      
      toast({
        title: 'Success',
        description: 'List reordered successfully',
      });

      socket?.emit('list:reorder', { listId, newParentId });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reorder list');
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handlers = {
      'list:create': fetchLists,
      'list:update': fetchLists,
      'list:delete': fetchLists,
      'list:share': fetchLists,
      'list:unshare': fetchLists,
      'list:reorder': fetchLists,
    };

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.keys(handlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [socket, fetchLists]);

  // Initial fetch
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return {
    lists,
    sharedLists,
    isLoading,
    error,
    createList,
    updateList,
    deleteList,
    shareList,
    removeShare,
    reorderLists,
  };
}