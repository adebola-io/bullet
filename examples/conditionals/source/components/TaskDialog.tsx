import { createElement } from '@/setup';
import type { Task, TaskStatus } from '@/types';
import { If, css } from '@adbl/bullet';
import { Cell, type SourceCell } from '@adbl/cells';

export interface TaskDialogProps {
  list: SourceCell<Task[]>;
  initialTask?: Cell<Task | null>;

  onClose?: () => void;
}

export const TaskDialog = createElement<TaskDialogProps>({
  tag: 'task-dialog',

  render: (props, __, host) => {
    const { list, onClose, initialTask } = props;

    const submitTask = (event: SubmitEvent): void => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const titleInput: HTMLInputElement = form['task-title'];
      const descriptionInput: HTMLTextAreaElement = form['task-description'];
      const statusSelect: HTMLSelectElement = form['task-status'];

      if (!titleInput.value) return;

      if (!initialTask) {
        const submitButton = form.querySelector(
          'button[type="submit"]:focus'
        ) as HTMLButtonElement;
        const position = submitButton?.dataset.position;
        if (!position) return;

        const newTask = {
          id: list.value.length + 1,
          title: titleInput.value,
          description: descriptionInput.value,
          status: Cell.source(statusSelect.value as TaskStatus),
        };
        addTask(newTask, position);
      } else {
        editTask(titleInput.value, descriptionInput.value, statusSelect.value);
      }
      closeDialog();
    };

    const addTask = (task: Task, position: string) => {
      switch (position) {
        case 'top':
          list.value.unshift(task);
          break;
        case 'end':
          list.value.push(task);
          break;
      }
    };

    const editTask = (
      title: string,
      description: string,
      selectStatus: string
    ) => {
      const id = initialTask?.value?.id;
      if (!id) return;

      const status = Cell.source(selectStatus as TaskStatus);
      const oldTask = list.value.findIndex((task) => task.id === id);
      list.value[oldTask] = { id, title, description, status };
    };

    const closeDialog = () => {
      const dialog = host.select('dialog');
      if (!dialog) return;

      dialog.close();
      document.documentElement.style.removeProperty('overflow');
      onClose?.();
    };

    const preSelectTodo = Cell.derived(() => {
      return !initialTask || initialTask?.value?.status.value === 'todo';
    });

    const preSelectInProgress = Cell.derived(() => {
      return initialTask?.value?.status.value === 'inProgress';
    });

    const preSelectDone = Cell.derived(() => {
      return initialTask?.value?.status.value === 'done';
    });

    return (
      <dialog class="dialog" popover="auto">
        {If(
          initialTask,
          () => {
            return <h2>Edit Task</h2>;
          },
          () => {
            return <h2>Add New Task</h2>;
          }
        )}
        <button type="button" class="close-dialog-button" onClick={closeDialog}>
          <svg viewBox="0 0 24 24">
            <title>Close Dialog</title>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <form onSubmit={submitTask}>
          <input
            class="form-input"
            placeholder="Enter title"
            type="text"
            name="task-title"
            required
          />
          <textarea
            class="form-textarea"
            placeholder="Enter description"
            name="task-description"
          />
          <select class="status-select" name="task-status">
            <option value="todo" selected={preSelectTodo}>
              Todo
            </option>
            <option value="inProgress" selected={preSelectInProgress}>
              In Progress
            </option>
            <option value="done" selected={preSelectDone}>
              Done
            </option>
          </select>
          {If(
            initialTask,
            () => {
              return (
                <div class="button-group">
                  <button class="button-group-button" type="submit">
                    Save
                  </button>
                </div>
              );
            },
            () => {
              return (
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
              );
            }
          )}
        </form>
      </dialog>
    );
  },

  connected: (props, host) => {
    const dialogElement = host.select('dialog');
    dialogElement?.showModal();
    document.documentElement.style.overflow = 'hidden';

    const { initialTask } = props;
    if (initialTask?.value) {
      const input = host.select<HTMLInputElement>('.form-input');
      const textarea = host.select<HTMLTextAreaElement>('.form-textarea');
      if (!input || !textarea) return;

      input.value = initialTask.value.title;
      textarea.value = initialTask.value.description;
    }
  },

  styles: css`
    .dialog {
      padding: 30px;
      border-radius: 8px;
      border: 1px solid #ccc;
      width: 80%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      &::backdrop {
        background-color: rgba(0, 0, 0, 0.6);
      }

      h2 {
        margin-top: 0;
        margin-bottom: 20px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    }

    .close-dialog-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      padding: 5px;

      svg {
        width: 20px;
        height: 20px;
        fill: #4a4a4a;
      }

      &:hover svg {
        fill: #333;
      }
    }

    .form-input,
    .form-textarea,
    .form-button {
      display: block;
      width: 100%;
      padding: 10px;
      font-family: inherit;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }

    .form-textarea {
      min-height: min(500px, 35vh);
    }

    .button-group-button {
      flex: 1;
      background-color: #4a4a4a;
      color: #fff;
      border: none;
      padding: 12px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #333;
      }
    }

    .status-select {
      padding: 10px;
      font-family: inherit;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
  `,
});
