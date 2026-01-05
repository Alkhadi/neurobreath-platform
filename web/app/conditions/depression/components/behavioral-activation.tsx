'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';

type Task = {
  id: string;
  text: string;
  completed: boolean;
  category: '1' | '3' | '5';
};

export function BehavioralActivation() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ '1': '', '3': '', '5': '' });

  // Load tasks from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage?.getItem('behavioralTasks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTasks(parsed ?? []);
        } catch (e) {
          console.error('Failed to parse tasks', e);
        }
      }
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    if (typeof window !== 'undefined') {
      localStorage?.setItem('behavioralTasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    }
  };

  const addTask = (category: '1' | '3' | '5') => {
    const text = newTask?.[category]?.trim();
    if (text) {
      const task: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
        category,
      };
      saveTasks([...(tasks ?? []), task]);
      setNewTask({ ...newTask, [category]: '' });
    }
  };

  const toggleTask = (id: string) => {
    const updated = tasks?.map?.((task) =>
      task?.id === id ? { ...task, completed: !(task?.completed ?? false) } : task
    ) ?? [];
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks?.filter?.((task) => task?.id !== id) ?? [];
    saveTasks(updated);
  };

  const getTasksByCategory = (category: '1' | '3' | '5') => {
    return tasks?.filter?.((task) => task?.category === category) ?? [];
  };

  const categories = [
    {
      key: '1' as const,
      title: '1 Big Thing',
      description: 'One important task that moves you forward',
      color: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900',
      iconColor: 'text-purple-600',
    },
    {
      key: '3' as const,
      title: '3 Medium Tasks',
      description: 'Three meaningful activities',
      color: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
    },
    {
      key: '5' as const,
      title: '5 Small Wins',
      description: 'Five simple, achievable actions',
      color: 'from-green-50 to-green-100',
      textColor: 'text-green-900',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Behavioral Activation</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Taking action, even small steps, is one of the most effective ways to break the cycle of depression
        </p>
      </div>

      {/* What is Behavioral Activation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-start space-x-3">
          <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">The 1-3-5 Framework</h3>
            <p className="text-gray-700 leading-relaxed">
              Behavioral Activation (BA) is an evidence-based component of Cognitive Behavioral Therapy. The principle is simple: <span className="font-semibold">action precedes motivation</span>. By scheduling and engaging in activities, particularly those aligned with your values, you can gradually improve mood and energy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Use this daily framework to structure achievable goals: <span className="font-semibold text-purple-700">1 big thing</span>, <span className="font-semibold text-blue-700">3 medium tasks</span>, and <span className="font-semibold text-green-700">5 small wins</span>. Start small and celebrate progress.
            </p>
          </div>
        </div>
      </div>

      {/* Task Categories */}
      <div className="space-y-6">
        {categories?.map?.((category, index) => {
          const categoryTasks = getTasksByCategory(category?.key);
          return (
            <motion.div
              key={category?.key}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: index * 0.15 }}
              className={`bg-gradient-to-r ${category?.color} rounded-xl shadow-lg p-6`}
            >
              <h3 className={`text-xl font-bold ${category?.textColor} mb-2`}>{category?.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{category?.description}</p>

              {/* Task List */}
              <div className="space-y-2 mb-4">
                {categoryTasks?.map?.((task) => (
                  <div
                    key={task?.id}
                    className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task?.id ?? '')}
                        className={`flex-shrink-0 ${category?.iconColor}`}
                      >
                        {task?.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>
                      <span
                        className={`text-sm ${
                          task?.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {task?.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(task?.id ?? '')}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )) ?? null}
              </div>

              {/* Add Task */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTask?.[category?.key] ?? ''}
                  onChange={(e) => setNewTask({ ...newTask, [category?.key]: e?.target?.value ?? '' })}
                  onKeyPress={(e) => {
                    if (e?.key === 'Enter') {
                      addTask(category?.key);
                    }
                  }}
                  placeholder={`Add a task...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  onClick={() => addTask(category?.key)}
                  className={`${category?.iconColor} bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <Plus size={20} />
                </button>
              </div>
            </motion.div>
          );
        }) ?? null}
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tips for Success</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Start small:</span> Even one task is progress</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Schedule activities:</span> Plan them like appointments</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Include pleasurable activities:</span> Not just obligations</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
            <p><span className="font-semibold">Track your mood:</span> Notice how activities affect you</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
