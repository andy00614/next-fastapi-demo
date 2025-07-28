const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  ai_summary?: string;
  created_at: string;
  updated_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const tasksApi = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async getTask(id: number): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json();
  },

  async createTask(task: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTask(id: number, task: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  async generateAISummary(id: number, prompt?: string): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}/ai-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: id, prompt }),
    });
    if (!response.ok) throw new Error('Failed to generate AI summary');
    return response.json();
  },
};