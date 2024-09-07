import type { SourceCell } from '@adbl/cells';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: SourceCell<TaskStatus>;
}

export type TaskStatus = 'todo' | 'inProgress' | 'done';
