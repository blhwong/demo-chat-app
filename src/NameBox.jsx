import React from 'react';
import './NameBox.css';

function NameBox({ name, onNameChanged, logIn }) {
  return (
    <div className="login">
      <form onSubmit={logIn}>
        <input
          type="text"
          name="name"
          id="name"
          onChange={onNameChanged}
          value={name}
          placeholder="Identity"
          autoComplete="off"
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

export default NameBox;
