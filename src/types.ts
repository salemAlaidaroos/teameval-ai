/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  weight: number;
  assignedTo?: string; // Student ID
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Contribution {
  id: string;
  studentId: string;
  taskId: string;
  timestamp: string;
  content: string; // text, link, or file ref
  type: 'file' | 'link' | 'text' | 'external';
  analysis?: {
    quality: 'Critical' | 'Major' | 'Minor';
    feedback: string;
    score: number; // 1-10
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'leader' | 'member';
}

export interface ProjectState {
  id: string;
  name: string;
  description: string;
  students: Student[];
  tasks: Task[];
  contributions: Contribution[];
}
