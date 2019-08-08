import React, { Component } from 'react';

class NameBox extends Component {
  render() {
    const { name } = this.props;
    const { onNameChanged } = this.props;
    const { logIn } = this.props;
    return (
      <div>
        <form onSubmit={logIn}>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={onNameChanged}
            value={name}
          />
          <button type="submit">Log in</button>
        </form>
      </div>
    );
  }
}

export default NameBox;
