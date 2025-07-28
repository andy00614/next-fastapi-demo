'use client';

import { useState, useEffect } from 'react';
import { Task, tasksApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Trash } from 'lucide-react';
import { TaskForm } from './TaskForm';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await tasksApi.updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleGenerateAI = async (task: Task) => {
    setGeneratingAI(task.id);
    try {
      const updated = await tasksApi.generateAISummary(task.id);
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (error) {
      console.error('Error generating AI summary:', error);
    } finally {
      setGeneratingAI(null);
    }
  };

  const handleTaskCreated = (task: Task) => {
    setTasks([...tasks, task]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskForm onTaskCreated={handleTaskCreated} />
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task)}
                  />
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.title}
                  </span>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateAI(task)}
                    disabled={generatingAI === task.id}
                  >
                    {generatingAI === task.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    AI Summary
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(task.description || task.ai_summary) && (
              <CardContent>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                )}
                {task.ai_summary && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> AI Summary
                    </p>
                    <p className="text-sm">{task.ai_summary}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}