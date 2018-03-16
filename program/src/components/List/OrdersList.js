import React, { Component } from 'react';
import List from './List';


class OrdersList extends Component {
  render() {
    return (
      <React.Fragment>
        <List.Header />
        <List />
      </React.Fragment>
    );
  }
}
