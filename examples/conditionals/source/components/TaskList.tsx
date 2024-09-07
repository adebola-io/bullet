import type { Task } from '@/types';
import { css, For } from '@adbl/bullet';
import type { Cell } from '@adbl/cells';
import { TaskItem } from './TaskItem';
import { createElement } from '@/setup';

interface TaskListProps {
  name: string;
  height: Cell<string>;
  tasks: Cell<Task[]>;

  onOptionsClick?: (task: Task, toggleButton: HTMLButtonElement) => void;
}

export const TaskList = createElement<TaskListProps>({
  tag: 'task-list',

  render: (props) => {
    const { height, tasks, onOptionsClick, name } = props;
    return (
      <div class="column">
        <h2>{name}</h2>
        <ul class="task-list" style={{ height }}>
          {For(tasks, (item, index) => {
            return (
              <TaskItem
                item={item}
                index={index}
                onOptionsClick={onOptionsClick}
              />
            );
          })}
        </ul>
      </div>
    );
  },

  styles: css`
    :host {
      position: relative;
      padding: 0;
      width: 100%;
      transition: height 0.3s ease;
    }

    ul {
      padding-left: 0;
      list-style-type: none;
    }
  `,
});
