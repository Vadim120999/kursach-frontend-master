'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/api';
import { Task } from '@/types';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks. Please login again.');
      router.push('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchTasks();
    }
  }, [router]);

  const handleTaskCreated = () => {
    fetchTasks();
    setShowForm(false);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create Task'}
          </Button>
        </div>
        {showForm && <TaskForm onTaskCreated={handleTaskCreated} />}
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} />
        ) : (
          <p className="text-muted-foreground">No tasks available. Create a new task to get started.</p>
        )}
      </div>
    </div>
  );
}
