import { createElement, css, For } from '@adbl/bullet';
import { SourceCell, Cell } from '@adbl/cells';

import styles from './App.css?inline';

interface Task {
  id: number;
  title: string;
  description: string;
  status: SourceCell<'todo' | 'inProgress' | 'done'>;
}

interface TaskItemProps {
  item: Task;
  index: Cell<number>;
}

const initialTasks = [
  {
    title: 'Buy groceries',
    description: 'Get milk, eggs, and bread',
    status: 'todo',
  },
  {
    title: 'Finish project report',
    description: 'Complete the quarterly report',
    status: 'inProgress',
  },
  {
    title: 'Call dentist for appointment',
    description: 'Schedule a checkup',
    status: 'done',
  },
  {
    title: 'Go for a 30-minute run',
    description: 'Run in the park',
    status: 'todo',
  },
  {
    title: 'Read a chapter of current book',
    description: 'Continue "The Great Gatsby"',
    status: 'inProgress',
  },
  {
    title: 'Water the plants',
    description: "Don't forget the orchids",
    status: 'done',
  },
  {
    title: 'Prepare presentation',
    description: 'Create slides for the team meeting',
    status: 'todo',
  },
  {
    title: 'Clean the garage',
    description: 'Organize tools and dispose of old items',
    status: 'todo',
  },
  {
    title: 'Update resume',
    description: 'Add recent projects and skills',
    status: 'inProgress',
  },
  {
    title: 'Pay bills',
    description: 'Electricity, water, and internet',
    status: 'done',
  },
  {
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodations',
    status: 'todo',
  },
  {
    title: 'Learn a new recipe',
    description: 'Try cooking a vegetarian dish',
    status: 'inProgress',
  },
  {
    title: 'Organize digital photos',
    description: 'Sort and label photos from last vacation',
    status: 'todo',
  },
  {
    title: 'Attend yoga class',
    description: 'Join the 7 PM session at the local studio',
    status: 'done',
  },
  {
    title: 'Fix leaky faucet',
    description: 'Replace washer in bathroom sink',
    status: 'todo',
  },
  {
    title: 'Write blog post',
    description: 'Draft article on time management tips',
    status: 'inProgress',
  },
  {
    title: 'Renew library books',
    description: 'Check due dates and renew online',
    status: 'done',
  },
  {
    title: 'Schedule car maintenance',
    description: 'Book appointment for oil change and tire rotation',
    status: 'todo',
  },
  {
    title: 'Start learning Spanish',
    description: 'Complete first lesson on language learning app',
    status: 'inProgress',
  },
  {
    title: 'Donate old clothes',
    description: 'Sort through wardrobe and prepare donation bag',
    status: 'todo',
  },
  {
    title: 'Backup computer files',
    description: 'Transfer important documents to external hard drive',
    status: 'inProgress',
  },
  {
    title: 'Attend networking event',
    description: 'RSVP and prepare business cards',
    status: 'todo',
  },
  {
    title: 'Plan birthday party',
    description: 'Create guest list and choose theme',
    status: 'inProgress',
  },
  {
    title: 'Get haircut',
    description: 'Book appointment at the salon',
    status: 'done',
  },
  {
    title: 'Research investment options',
    description: 'Compare mutual funds and ETFs',
    status: 'todo',
  },
  {
    title: 'Practice meditation',
    description: 'Follow 15-minute guided meditation',
    status: 'inProgress',
  },
];

const listToRender: SourceCell<Task[]> = Cell.source(
  initialTasks.map(function (task, index) {
    return {
      id: index + 1,
      title: task.title,
      description: task.description,
      status: Cell.source(task.status as 'todo' | 'inProgress' | 'done'),
    };
  })
);

const todoTasks = Cell.derived(function () {
  return listToRender.value.filter(function (task) {
    return task.status.value === 'todo';
  });
});
const inProgressTasks = Cell.derived(function () {
  return listToRender.value.filter(function (task) {
    return task.status.value === 'inProgress';
  });
});
const doneTasks = Cell.derived(function () {
  return listToRender.value.filter(function (task) {
    return task.status.value === 'done';
  });
});

const todoTasksListHeight = Cell.derived(function () {
  const todoTasksCount = todoTasks.value.length;
  const baseHeight = todoTasksCount * 130; // Increased base height per item
  const itemPaddingOffsets = todoTasksCount * 15;
  const listBottomPadding = 20;
  return `${baseHeight + itemPaddingOffsets + listBottomPadding}px`;
});

const inProgressTasksListHeight = Cell.derived(function () {
  const inProgressTasksCount = inProgressTasks.value.length;
  const baseHeight = inProgressTasksCount * 130; // Increased base height per item
  const itemPaddingOffsets = inProgressTasksCount * 15;
  const listBottomPadding = 20;
  return `${baseHeight + itemPaddingOffsets + listBottomPadding}px`;
});

const doneTasksListHeight = Cell.derived(function () {
  const doneTasksCount = doneTasks.value.length;
  const baseHeight = doneTasksCount * 130; // Increased base height per item
  const itemPaddingOffsets = doneTasksCount * 15;
  const listBottomPadding = 20;
  return `${baseHeight + itemPaddingOffsets + listBottomPadding}px`;
});

export const App = createElement({
  tag: 'task-list',
  render(_, __, element) {
    function openDialog() {
      const dialogElement = element.select('dialog');
      dialogElement?.showModal();
      document.documentElement.style.overflow = 'hidden';
    }

    function closeDialog() {
      const dialogElement = element.select('dialog');
      dialogElement?.close();
      document.documentElement.style.removeProperty('overflow');
    }

    function addTask(this: HTMLFormElement, event: SubmitEvent): void {
      event.preventDefault();
      const titleInput: HTMLInputElement = this['task-title'];
      const descriptionInput: HTMLInputElement = this['task-description'];
      const statusSelect: HTMLSelectElement = this['task-status'];
      const submitButton = this.querySelector<HTMLButtonElement>(
        'button[type="submit"]:focus'
      );
      const position = submitButton?.dataset.position;

      if (!titleInput.value || !position) return;

      const newTask = {
        id: listToRender.value.length + 1,
        title: titleInput.value,
        description: descriptionInput.value,
        status: Cell.source(
          statusSelect.value as 'todo' | 'inProgress' | 'done'
        ),
      };

      switch (position) {
        case 'top':
          listToRender.value.unshift(newTask);
          break;
        case 'end':
          listToRender.value.push(newTask);
          break;
      }

      titleInput.value = '';
      descriptionInput.value = '';
      statusSelect.value = 'todo';
      closeDialog();
    }

    return (
      <div class="container">
        <div class="top-row">
          <h1>Task List</h1>
          <button class="add-task-button" onClick={openDialog}>
            Add New Task
          </button>
        </div>
        <div class="grid">
          <div class="column">
            <h2>Todo</h2>
            <ul class="task-list" style={{ height: todoTasksListHeight }}>
              {For(todoTasks, function (item, index) {
                return <TaskItem item={item} index={index} />;
              })}
            </ul>
          </div>
          <div class="column">
            <h2>In Progress</h2>
            <ul class="task-list" style={{ height: inProgressTasksListHeight }}>
              {For(inProgressTasks, function (item, index) {
                return <TaskItem item={item} index={index} />;
              })}
            </ul>
          </div>
          <div class="column">
            <h2>Completed</h2>
            <ul class="task-list" style={{ height: doneTasksListHeight }}>
              {For(doneTasks, function (item, index) {
                return <TaskItem item={item} index={index} />;
              })}
            </ul>
          </div>
        </div>
        <dialog class="dialog" popover="auto">
          <h2>Add New Task</h2>
          <button class="close-dialog-button" onClick={closeDialog}>
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <form onSubmit={addTask}>
            <input
              class="form-input"
              placeholder="Enter title"
              type="text"
              name="task-title"
              required
            />
            <input
              class="form-input"
              placeholder="Enter description"
              type="text"
              name="task-description"
            />
            <select class="status-select" name="task-status">
              <option value="todo" selected>
                Todo
              </option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div class="button-group">
              <button
                class="button-group-button"
                type="submit"
                data-position="top"
              >
                Add to Top
              </button>
              <button
                class="button-group-button"
                type="submit"
                data-position="end"
              >
                Add to Bottom
              </button>
            </div>
          </form>
        </dialog>
      </div>
    );
  },

  globalStyles: css`
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
      background-color: #f8f8f8;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 20px;

      @media (max-width: 768px) {
        padding: 20px 10px;
      }
    }
  `,

  styles: css(styles),
});

/**
 * Renders a single task item in the task list.
 *
 * @param props - The properties for the TaskItem component
 * @param props.item - The task object containing id, title, description, and status
 * @param props.index - The index of the task in its respective list (todo, inProgress, or done)
 * @returns An HTMLLIElement representing the task item
 */
function TaskItem(props: TaskItemProps): HTMLLIElement {
  const { item, index } = props;
  const popupVisible = Cell.source(false);
  const moveSubmenuVisible = Cell.source(false);

  const transform = Cell.derived(function () {
    if (index.value === 0) return 'none';

    const percent = index.value * 100;
    const shift = index.value * 15;
    return `translateY(calc(${percent}% + ${shift}px))`;
  });

  const textDecoration = Cell.derived(function () {
    if (item.status.value === 'done') {
      return 'line-through';
    }
  });

  function updateStatus(newStatus: 'todo' | 'inProgress' | 'done'): void {
    item.status.value = newStatus;
    popupVisible.value = false;
    moveSubmenuVisible.value = false;
  }

  function deleteTask(): void {
    listToRender.value = listToRender.value.filter(function (task) {
      return task.id !== item.id;
    });
  }

  popupVisible.listen(function (isVisible) {
    if (isVisible) {
      addEventListener('click', closePopupOnOutsideClick, { once: true });
    }
  });

  function togglePopup(event: MouseEvent) {
    if (!popupVisible.value) {
      event.stopPropagation();
    }
    popupVisible.value = !popupVisible.value;
  }

  function closePopupOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!popupVisible.value || !target.closest('.popup-menu')) {
      popupVisible.value = false;
      moveSubmenuVisible.value = false;
    }
  }

  function toggleMoveSubmenu(event: MouseEvent): void {
    event.stopPropagation();
    moveSubmenuVisible.value = !moveSubmenuVisible.value;
  }

  const popupMenuClass = Cell.derived(function () {
    return popupVisible.value ? 'popup-menu visible' : 'popup-menu';
  });

  const moveSubmenuClass = Cell.derived(function () {
    return moveSubmenuVisible.value ? 'submenu visible' : 'submenu';
  });

  const todoButtonDisabled = Cell.derived(function () {
    return item.status.value === 'todo';
  });
  const inProgressButtonDisabled = Cell.derived(function () {
    return item.status.value === 'inProgress';
  });
  const doneButtonDisabled = Cell.derived(function () {
    return item.status.value === 'done';
  });

  return (
    <li class="task-item" style={{ transform }} data-index={index}>
      <div class="task-header">
        <h3 class="task-title" style={{ textDecoration }}>
          {item.title}
        </h3>
        <div class="task-actions">
          <button
            type="button"
            class="more-options-button"
            onClick={togglePopup}
          >
            ⋮
          </button>
          <div class={popupMenuClass}>
            <button
              class="move-to-button"
              onClick={toggleMoveSubmenu}
              onMouseEnter={function () {
                moveSubmenuVisible.value = true;
              }}
            >
              Move to <span class="arrow">▸</span>
            </button>
            <button onClick={deleteTask} class="delete-button">
              Delete Task
            </button>
          </div>
          <div
            class={moveSubmenuClass}
            onMouseLeave={function () {
              moveSubmenuVisible.value = false;
            }}
          >
            <button
              onClick={function () {
                updateStatus('todo');
              }}
              disabled={todoButtonDisabled}
            >
              Todo
            </button>
            <button
              onClick={function () {
                updateStatus('inProgress');
              }}
              disabled={inProgressButtonDisabled}
            >
              In Progress
            </button>
            <button
              onClick={function () {
                updateStatus('done');
              }}
              disabled={doneButtonDisabled}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      <p class="task-description">{item.description}</p>
    </li>
  );
}
