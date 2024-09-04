import { createElement, css, For, If } from '@adbl/bullet';
import { Cell } from '@adbl/cells';

interface Article {
  title: string;
  content: string;
}

const isLoggedIn = Cell.source(false);
const username = Cell.source('');
const listToRender = Cell.source<Article[]>([
  {
    title: 'Getting Started with Bullet',
    content:
      'Bullet is a lightweight and efficient UI library for building web applications. It offers reactive programming and a component-based architecture.',
  },
  {
    title: 'Reactive Programming in Bullet',
    content:
      'Bullet uses a reactive programming model, allowing you to create dynamic UIs that automatically update when data changes. This makes it easy to build interactive applications.',
  },
  {
    title: 'Component-Based Architecture',
    content:
      'In Bullet, you can create reusable components to structure your application. This modular approach helps in maintaining and scaling your codebase effectively.',
  },
  {
    title: 'State Management in Bullet',
    content:
      'Bullet provides a simple and intuitive way to manage state using Cells. Cells are reactive containers that automatically update your UI when their values change.',
  },
  {
    title: 'Performance Optimization in Bullet',
    content:
      'Bullet is designed for high performance. It uses a virtual DOM and efficient rendering techniques to ensure your application runs smoothly, even with complex UIs.',
  },
  {
    title: 'Styling in Bullet',
    content:
      'Bullet supports various styling approaches, including CSS-in-JS. This allows you to write scoped styles directly in your component files, improving modularity and maintainability.',
  },
]);

const changeLoggedInStatus = () => {
  isLoggedIn.value = !isLoggedIn.value;
};

const logIn = (event: Event) => {
  event.preventDefault();
  if (!username.value) return;
  isLoggedIn.value = true;
};

const setUsername = (event: Event) => {
  const target = event.target as HTMLInputElement;
  username.value = target.value;
};

const LoggedInView = () => {
  return (
    <div>
      <h3>Welcome back, {username}!</h3>
      <button type="button" onClick={changeLoggedInStatus}>
        Logout
      </button>
    </div>
  );
};

const LoggedOutView = () => {
  return (
    <form onSubmit={logIn}>
      <h3>Please log in</h3>
      <input type="text" placeholder="Enter username" onInput={setUsername} />
      <button type="submit">Login</button>
    </form>
  );
};

const addArticle = (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const input = form['article-title'] as HTMLInputElement;
  const textarea = form['article-content'] as HTMLTextAreaElement;
  const submitButton = form.querySelector(
    'button[type="submit"]:focus'
  ) as HTMLButtonElement;
  const position = submitButton?.dataset.position as
    | 'top'
    | 'middle'
    | 'end'
    | undefined;

  if (!input.value || !textarea.value || !position) return;

  const newArticle = {
    title: input.value,
    content: textarea.value,
  };

  switch (position) {
    case 'top':
      listToRender.value = [newArticle, ...listToRender.value];
      break;
    case 'middle':
      {
        const middleIndex = Math.floor(listToRender.value.length / 2);
        const newList = [...listToRender.value];
        newList.splice(middleIndex, 0, newArticle);
        listToRender.value = newList;
      }
      break;
    case 'end':
      listToRender.value = [...listToRender.value, newArticle];
      break;
  }

  input.value = '';
  textarea.value = '';
};

const Article = ({ item, index }: { item: Article; index: Cell<number> }) => (
  <li>
    <div class="article-header">
      <h3>{item.title}</h3>
      <button
        type="button"
        class="cancel-button"
        onClick={() => {
          listToRender.value.splice(index.value, 1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-labelledby="deleteIconTitle"
        >
          <title id="deleteIconTitle" xmlns="http://www.w3.org/2000/svg">
            Delete article
          </title>
          <path
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            d="M0 0h24v24H0z"
          />
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
          />
        </svg>
      </button>
    </div>
    <p>{item.content}</p>
  </li>
);

export const App = createElement({
  tag: 'login-status',
  render: () => {
    return (
      <div class="container">
        <h1>Reactivity in Bullet</h1>
        <div class="grid">
          <div class="column">
            <h2>Conditional Rendering</h2>
            {If(isLoggedIn, LoggedInView, LoggedOutView)}

            <h2>Create an Article</h2>
            <form onSubmit={addArticle}>
              <input
                placeholder="Enter title"
                type="text"
                name="article-title"
              />
              <textarea placeholder="Enter content" name="article-content" />
              <div class="button-group">
                <button type="submit" data-position="top">
                  Add to Top
                </button>
                <button type="submit" data-position="middle">
                  Add to Middle
                </button>
                <button type="submit" data-position="end">
                  Add to End
                </button>
              </div>
            </form>
          </div>
          <div class="column">
            <h2>Articles</h2>
            <ul>
              {For(listToRender, (item, index) => {
                return <Article item={item} index={index} />;
              })}
            </ul>
          </div>
        </div>
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
      grid-template-columns: 1fr 1fr;
      gap: 40px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .column {
      min-width: 0;
    }

    form {
      margin-bottom: 20px;

      input,
      textarea,
      button {
        display: block;
        width: 100%;
        margin-bottom: 15px;
        padding: 10px;
        font-family: inherit;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }

      textarea {
        height: 120px;
      }

      .button-group {
        display: flex;
        gap: 10px;

        button {
          flex: 1;
          background-color: #4a4a4a;
          color: #fff;
          border: none;
          padding: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #333;
          }
        }
      }

      button {
        background-color: #4a4a4a;
        color: #fff;
        border: none;
        padding: 12px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #333;
        }
      }
    }

    ul {
      list-style-type: none;
      padding: 0;

      li {
        border: 1px solid #ddd;
        padding: 15px;
        margin-bottom: 15px;
        background-color: #fff;
        position: relative;
      }
    }

    .article-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .cancel-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;

      svg {
        fill: #4a4a4a;
        transition: fill 0.3s ease, background-color 0.3s ease;
      }

      &:hover {
        background-color: #333;

        svg {
          fill: #fff;
        }
      }
    }
  `,
});
