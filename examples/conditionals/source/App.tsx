import { css, For, If } from '@adbl/bullet';
import { createElement } from '@/setup';
import { Cell } from '@adbl/cells';
import type { Task, TaskStatus } from '@/types';

import { Popup } from '@/components/Popup';
import { TaskList } from '@/components/TaskList';
import { TaskDialog } from '@/components/TaskDialog';

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

const list = Cell.source<Task[]>(
  initialTasks.map((task, index) => {
    return {
      id: index + 1,
      title: task.title,
      description: task.description,
      status: Cell.source(task.status as TaskStatus),
    };
  })
);

interface Column {
  name: string;
  tasks: Cell<Task[]>;
}

const columns: Record<TaskStatus, Column> = {
  todo: {
    name: 'Todo',
    tasks: Cell.derived(() => {
      return list.value.filter((task) => {
        return task.status.value === 'todo';
      });
    }),
  },
  inProgress: {
    name: 'In Progress',
    tasks: Cell.derived(() => {
      return list.value.filter((task) => {
        return task.status.value === 'inProgress';
      });
    }),
  },
  done: {
    name: 'Completed',
    tasks: Cell.derived(() => {
      return list.value.filter((task) => {
        return task.status.value === 'done';
      });
    }),
  },
};

const listBottomPadding = 20;

const todoTasksListHeight = Cell.derived(() => {
  return `${columns.todo.tasks.value.length * 145 + listBottomPadding}px`;
});

const inProgressTasksListHeight = Cell.derived(() => {
  return `${columns.inProgress.tasks.value.length * 145 + listBottomPadding}px`;
});

const doneTasksListHeight = Cell.derived(() => {
  return `${columns.done.tasks.value.length * 145 + listBottomPadding}px`;
});

export const App = createElement({
  tag: 'task-app',

  render: () => {
    const taskDialogIsOpen = Cell.source(false);
    const initialTask = Cell.source<Task | null>(null);
    const selectedTask = Cell.source<Task | null>(null);
    const popupAnchor = Cell.source<HTMLElement | null>(null);
    const optionsSubMenuIsOpen = Cell.source(false);

    const openDialog = () => {
      taskDialogIsOpen.value = true;
    };

    const closeDialog = () => {
      taskDialogIsOpen.value = false;
      initialTask.value = null;
    };

    const selectTask = (task: Task, button: HTMLElement) => {
      popupAnchor.value = button;
      selectedTask.value = task;
    };

    const removeSelection = () => {
      selectedTask.value = null;
      popupAnchor.value = null;
      optionsSubMenuIsOpen.value = false;
    };

    const deleteSelectedTask = () => {
      list.value = list.value.filter(
        (task) => task.id !== selectedTask.value?.id
      );
      selectedTask.value = null;
      popupAnchor.value = null;
    };

    const openSubMenu = () => {
      optionsSubMenuIsOpen.value = true;
    };

    const closeSubMenu = () => {
      optionsSubMenuIsOpen.value = false;
    };

    const openTaskEditing = () => {
      initialTask.value = selectedTask.value;
      taskDialogIsOpen.value = true;
      removeSelection();
    };

    return (
      <div class="container">
        <div class="top-row">
          <h1>Task List</h1>
          <button type="button" class="add-task-button" onClick={openDialog}>
            Add New Task
          </button>
        </div>

        {/* Columns */}
        <div class="grid">
          <TaskList
            name="Todo"
            height={todoTasksListHeight}
            tasks={columns.todo.tasks}
            onOptionsClick={selectTask}
          />
          <TaskList
            name="In Progress"
            height={inProgressTasksListHeight}
            tasks={columns.inProgress.tasks}
            onOptionsClick={selectTask}
          />
          <TaskList
            name="Completed"
            height={doneTasksListHeight}
            tasks={columns.done.tasks}
            onOptionsClick={selectTask}
          />
        </div>

        {/* Popup List. */}
        {If(selectedTask, (task) => {
          return (
            <Popup
              attr:popover="auto"
              attr:onBeforeToggle={removeSelection}
              anchor={popupAnchor.value}
              preferredAnchorPosition="top-right"
            >
              <menu class="options-menu">
                <Popup.ListItem attr:onClick={openTaskEditing}>
                  Edit Task
                </Popup.ListItem>
                <Popup.ListItem
                  hasSubmenu
                  attr:onMouseOver={openSubMenu}
                  attr:onMouseLeave={closeSubMenu}
                >
                  Move to
                  {If(optionsSubMenuIsOpen, () => {
                    return (
                      <Popup.SubMenu>
                        {For(Object.entries(columns), ([key, column]) => {
                          if (task.status.value === key) return;
                          const changeTaskStatus = () => {
                            task.status.value = key as TaskStatus;
                            removeSelection();
                          };
                          return (
                            <Popup.ListItem attr:onClick={changeTaskStatus}>
                              {column.name}
                            </Popup.ListItem>
                          );
                        })}
                      </Popup.SubMenu>
                    );
                  })}
                </Popup.ListItem>
                <Popup.ListItem
                  attr:onClick={deleteSelectedTask}
                  attr:class="delete-task-option"
                >
                  Delete
                </Popup.ListItem>
              </menu>
            </Popup>
          );
        })}
        {If(taskDialogIsOpen, () => {
          return (
            <TaskDialog
              list={list}
              initialTask={initialTask}
              onClose={closeDialog}
            />
          );
        })}
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

  styles: css`
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    h1,
    h2,
    h3 {
      font-family: Georgia, 'Times New Roman', Times, serif;
    }

    h1 {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .add-task-button {
      background-color: #4a4a4a;
      color: #fff;
      border: none;
      padding: 12px 20px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      font-size: 1rem;
      margin-bottom: 20px;

      &:hover {
        background-color: #333;
      }
    }

    .options-menu {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
    }

    .delete-task-option {
      color: red;
    }
  `,
});
