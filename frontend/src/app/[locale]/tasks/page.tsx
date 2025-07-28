import { TaskList } from '@/components/tasks/TaskList';

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">AI Task Manager</h1>
      <TaskList />
    </div>
  );
}