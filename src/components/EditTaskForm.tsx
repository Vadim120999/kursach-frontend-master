'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { taskSchema } from '@/lib/schemas';
import { updateTask, getTasks } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Task } from '@/types';

interface EditTaskFormProps {
  task: Task;
  onTaskUpdated: () => void;
  onClose: () => void;
}

export function EditTaskForm({ task, onTaskUpdated, onClose }: EditTaskFormProps) {
  const [existingTasks, setExistingTasks] = useState<Task[]>([]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: task.projectId,
      name: task.name,
      description: task.description || '',
      duration: task.duration,
      startDate: task.startDate ? new Date(task.startDate).toISOString().slice(0, 16) : '',
      endDate: task.endDate ? new Date(task.endDate).toISOString().slice(0, 16) : '',
      dependencyIds: task.dependencies.map(dep => dep.dependencyId) || [],
    },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const projectId = form.getValues('projectId');
        if (projectId) {
          const tasks = await getTasks(projectId);
          setExistingTasks(tasks.filter((t: Task) => t.id !== task.id));
        }
      } catch (error) {
        toast.error('Failed to load tasks for dependencies.');
      }
    };
    fetchTasks();
  }, [form.watch('projectId'), task.id]);

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      const formattedData = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };
      await updateTask(task.id, formattedData);
      toast.success('Task updated successfully!');
      onTaskUpdated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update task. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Task 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (days)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date (Optional)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Optional)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dependencyIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dependencies (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  const currentValues = field.value || [];
                  if (currentValues.includes(value)) {
                    field.onChange(currentValues.filter((id: string) => id !== value));
                  } else {
                    field.onChange([...currentValues, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dependencies" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {existingTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {field.value && field.value.length > 0 && field.value.map((id: string) => {
                  const task = existingTasks.find(t => t.id === id);
                  return (
                    <div key={id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                      {task?.name || id}
                      <button
                        type="button"
                        onClick={() => field.onChange(field.value.filter((depId: string) => depId !== id))}
                        className="text-destructive hover:text-destructive-foreground"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
