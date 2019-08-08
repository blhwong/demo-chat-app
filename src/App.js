import React, { Component } from 'react';
import ChatApp from './ChatApp';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Conversations</h1>
          <h2>+1 (424) 339-0866</h2>
        </header>
        <ChatApp />
      </div>
    );
  }
}

export default App;
