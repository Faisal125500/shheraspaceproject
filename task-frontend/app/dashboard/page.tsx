'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Task {
  id: number;
  task_name: string;
  status: boolean;
  date?: string;
  due_date?: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    if (name) setUserName(name);
    if (email) setUserEmail(email);
    if (!userId) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const res = await fetch(`https://shheraspaceproject.onrender.com/tasks/${userId}`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!taskName.trim()) return;
    
    setAdding(true);
    try {
      await fetch('https://shheraspaceproject.onrender.com/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_name: `${taskName}${taskDate ? ` (Due: ${taskDate})` : ''}`,
          user_id: localStorage.getItem('user_id')
        })
      });
      setTaskName('');
      setTaskDate('');
      fetchTasks();
      toast.success('Task added!');
    } catch (error) {
      toast.error('Error adding task');
    } finally {
      setAdding(false);
    }
  };

  const toggleStatus = async (taskId: number, currentStatus: boolean) => {
    try {
      await fetch(`https://shheraspaceproject.onrender.com/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !currentStatus })
      });
      fetchTasks();
      toast.success('Task updated!');
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await fetch(`https://shheraspaceproject.onrender.com/tasks/${taskId}`, {
        method: 'DELETE'
      });
      fetchTasks();
      toast.success('Task deleted!');
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    router.push('/login');
  };

  // Helper to get initials from email
  const getInitials = (email: string) => {
    if (!email) return '';
    const name = email.split('@')[0];
    const parts = name.split(/[._-]/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskName(task.task_name.replace(/ \(Due: .+\)$/, ''));
    setEditTaskDueDate(task.due_date || extractDueDate(task.task_name) || '');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTaskName('');
    setEditTaskDueDate('');
  };

  const saveEdit = async (task: Task) => {
    try {
      await fetch(`https://shheraspaceproject.onrender.com/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_name: editTaskName + (editTaskDueDate ? ` (Due: ${editTaskDueDate})` : ''),
          due_date: editTaskDueDate
        })
      });
      fetchTasks();
      toast.success('Task updated!');
    } catch (error) {
      toast.error('Error updating task');
    } finally {
      cancelEdit();
    }
  };

  // Helper to extract due date from task_name if due_date is not present
  const extractDueDate = (taskName: string) => {
    const match = taskName.match(/\(Due: ([^)]+)\)/);
    return match ? match[1] : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-indigo-900/80">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-[var(--primary)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div className="w-80 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-96 h-20 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-96 h-20 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-indigo-900/80 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {getInitials(userEmail)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{userName ? `${userName}'s Tasks` : 'Your Tasks'}</h1>
              <p className="text-gray-200 mt-1 text-lg">Manage your daily tasks efficiently</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-danger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>

        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What needs to be done?"
                className="input-primary"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  placeholder="YYYY-MM-DD (Optional)"
                  className="input-primary text-sm"
                  pattern="\d{4}-\d{2}-\d{2}"
                />
                <div className="text-xs text-[var(--text-secondary)]">Format: YYYY-MM-DD</div>
              </div>
            </div>
            <button
              onClick={addTask}
              disabled={adding || !taskName.trim()}
              className={`btn-primary h-fit ${(adding || !taskName.trim()) ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {adding ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
              {adding ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="task-item group"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => toggleStatus(task.id, task.status)}
                    className="checkbox-custom"
                  />
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        className="input-primary w-48"
                        value={editTaskName}
                        onChange={e => setEditTaskName(e.target.value)}
                      />
                      <input
                        type="text"
                        className="input-primary w-36"
                        placeholder="YYYY-MM-DD (Optional)"
                        value={editTaskDueDate}
                        onChange={e => setEditTaskDueDate(e.target.value)}
                      />
                      <button className="btn-primary px-3 py-1" onClick={() => saveEdit(task)}>Save</button>
                      <button className="btn-secondary px-3 py-1" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className={`$
                        {task.status 
                          ? 'line-through text-[var(--text-secondary)]' 
                          : 'text-[var(--text-primary)]'
                        } text-lg transition-all duration-200`}>
                        {task.task_name}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        {task.due_date || extractDueDate(task.task_name)}
                      </span>
                      <button className="ml-2 text-blue-500 hover:underline" onClick={() => startEdit(task)}>Edit</button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-[var(--text-secondary)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-all duration-200 text-xl"
                >
                  🗑️
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--text-secondary)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-[var(--text-secondary)] text-lg">No tasks yet. Add some tasks to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 