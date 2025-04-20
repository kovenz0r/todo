import React, { useState, useEffect } from 'react';
import './App.css';

function getInitialData() {
  const saved = localStorage.getItem('todoLists');
  if (saved) return JSON.parse(saved);
  return {
    lists: [{ name: 'My List', todos: [] }],
    selected: 0
  };
}

export default function App() {
  const [data, setData] = useState(getInitialData);
  const [input, setInput] = useState('');
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    localStorage.setItem('todoLists', JSON.stringify(data));
  }, [data]);

  const currentList = data.lists[data.selected];

  function addTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const lists = [...data.lists];
    lists[data.selected] = {
      ...lists[data.selected],
      todos: [...lists[data.selected].todos, { text: input, done: false }]
    };
    setData({ ...data, lists });
    setInput('');
  }

  function toggleTodo(idx) {
    const lists = [...data.lists];
    lists[data.selected].todos = lists[data.selected].todos.map((todo, i) =>
      i === idx ? { ...todo, done: !todo.done } : todo
    );
    setData({ ...data, lists });
  }

  function deleteTodo(idx) {
    const lists = [...data.lists];
    lists[data.selected].todos = lists[data.selected].todos.filter((_, i) => i !== idx);
    setData({ ...data, lists });
  }

  function addList(e) {
    e.preventDefault();
    const name = newListName.trim();
    if (!name) return;
    if (data.lists.some(l => l.name === name)) return;
    setData({
      lists: [...data.lists, { name, todos: [] }],
      selected: data.lists.length
    });
    setNewListName('');
  }

  function selectList(idx) {
    setData({ ...data, selected: idx });
  }

  function deleteList(idx) {
    if (data.lists.length === 1) return; // Always keep at least one list
    const listName = data.lists[idx].name;
    if (!window.confirm(`Are you sure you want to delete the list "${listName}"? This cannot be undone.`)) return;
    let lists = data.lists.filter((_, i) => i !== idx);
    let selected = data.selected;
    if (selected >= lists.length) selected = lists.length - 1;
    setData({ lists, selected });
  }

  return (
    <div className="multi-container">
      <aside className="sidebar">
        <h2>Lists</h2>
        <ul className="list-selector">
          {data.lists.map((list, idx) => (
            <li key={list.name} className={idx === data.selected ? 'active' : ''}>
              <button onClick={() => selectList(idx)}>{list.name}</button>
              {data.lists.length > 1 && (
                <button className="delete-list" title="Delete list" onClick={() => deleteList(idx)}>✕</button>
              )}
            </li>
          ))}
        </ul>
        <form className="add-list-form" onSubmit={addList}>
          <input
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            placeholder="New list name"
            aria-label="New list name"
          />
          <button type="submit">Add List</button>
        </form>
      </aside>
      <main className="container">
        <h1>{currentList.name}</h1>
        <form onSubmit={addTodo} className="todo-form">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
          />
          <button type="submit">Add</button>
        </form>
        <ul className="todo-list">
          {currentList.todos.length === 0 && <li className="empty">No tasks yet!</li>}
          {currentList.todos.map((todo, idx) => (
            <li key={idx} className={todo.done ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(idx)} />
                <span>{todo.text}</span>
              </label>
              <button className="delete" onClick={() => deleteTodo(idx)} title="Delete">✕</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
