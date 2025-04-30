import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle>{task.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{task.description || 'No description'}</p>
            <p>Duration: {task.duration} days</p>
            {task.dependencies.length > 0 && (
              <p>Dependencies: {task.dependencies.map((dep) => dep.dependencyId).join(', ')}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}