import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deleteTask } from '@/lib/api';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { EditTaskForm } from './EditTaskForm';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export function TaskList({ tasks, onTaskUpdated }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully!');
        onTaskUpdated();
      } catch (error) {
        toast.error('Failed to delete task. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{task.name}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
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
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <EditTaskForm
              task={editingTask}
              onTaskUpdated={onTaskUpdated}
              onClose={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
