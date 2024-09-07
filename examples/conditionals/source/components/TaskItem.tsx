import { createElement } from '@/setup';
import type { Task } from '@/types';
import { css } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

export interface TaskItemProps {
  item: Task;
  index: Cell<number>;
  onOptionsClick?: (task: Task, toggleButton: HTMLButtonElement) => void;
}

/**
 * Renders a single task item in the task list.
 *
 * @param props - The properties for the TaskItem component
 * @param props.item - The task object containing id, title, description, and status
 * @param props.index - The index of the task in its respective list (todo, inProgress, or done)
 * @returns An HTMLLIElement representing the task item
 */
export const TaskItem = createElement<TaskItemProps>({
  tag: 'task-item',

  render: (props, __, host) => {
    const { item, index } = props;

    index.runAndListen((value) => {
      if (value === 0) {
        host.style.transform = 'none';
        return;
      }

      const percent = value * 100;
      const shift = value * 15;
      host.style.transform = `translateY(calc(${percent}% + ${shift}px))`;
    });

    const textDecoration = Cell.derived(() => {
      if (item.status.value === 'done') {
        return 'line-through';
      }
    });

    const handleOptionsButtonClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLButtonElement;
      props.onOptionsClick?.(item, target);
    };

    return (
      <li class="task-item" data-index={index}>
        <div class="task-header">
          <h3 class="task-title" style={{ textDecoration }}>
            {item.title}
          </h3>
          <div class="task-actions">
            <button
              title="Options"
              type="button"
              class="more-options-button"
              onClick={handleOptionsButtonClick}
            >
              ⋮
            </button>
          </div>
        </div>
        <p class="task-description">{item.description}</p>
      </li>
    );
  },
  styles: css`
    :host {
      position: absolute;
      display: flex;
      flex-direction: column;
      border: 1px solid #ddd;
      padding: 15px;
      width: calc(100% - 32px);
      background-color: #fff;
      height: auto;
      min-height: 100px;
      transition-duration: 300ms;
      transition-property: transform;
    }

    .task-title {
      display: flex;
      font-size: 1rem;
      margin: 0;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .task-description {
      margin: 0;
      font-size: 0.9em;
      color: #666;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      line-height: 1.4em;
      max-height: 4.2em;
    }

    .task-actions {
      position: relative;
    }

    .more-options-button {
      background-color: transparent;
      border: none;
      font-size: 24px;
      font-weight: bold;

      &:hover {
        color: gray;
      }
    }
  `,
});
