'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/api';
import { Task } from '@/types';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { TaskList } from '@/components/TaskList';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        toast.error('Failed to fetch tasks. Please login again.');
        router.push('/login');
      }
    };
    fetchTasks();
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}