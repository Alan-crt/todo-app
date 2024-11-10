export enum PermissionLevel {
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    ADMIN = 'ADMIN'
  }
  
  export interface List {
    id: string;
    name: string;
    ownerId: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ListWithChildren extends List {
    children: ListWithChildren[];
  }
  
  export interface SharedList {
    id: string;
    listId: string;
    userId: string;
    permissionLevel: PermissionLevel;
    list: List;
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }
  
  export interface ListWithSharing extends List {
    sharedWith: SharedList[];
    children: ListWithSharing[];
  }
  
  // Custom type guards
  export function isListWithChildren(list: List | ListWithChildren): list is ListWithChildren {
    return 'children' in list;
  }
  
  export function isListWithSharing(list: List | ListWithSharing): list is ListWithSharing {
    return 'sharedWith' in list;
  }