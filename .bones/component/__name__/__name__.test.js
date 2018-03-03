import React from 'react';
import ReactDOM from 'react-dom';
import {__name__} from './__name__';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<__name__ />, div);
  ReactDOM.unmountComponentAtNode(div);
});
