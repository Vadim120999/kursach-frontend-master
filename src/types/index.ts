export interface User {
    id: string;
    email: string;
    name?: string;
  }
  
  export interface Task {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    duration: number;
    startDate?: string;
    endDate?: string;
    dependencies: TaskDependency[];
  }
  
  export interface TaskDependency {
    id: string;
    dependentId: string;
    dependencyId: string;
  }