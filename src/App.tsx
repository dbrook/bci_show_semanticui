import React from 'react';
import './App.css';

import 'semantic-ui-css/semantic.css';

// Temporary includes to just get the examples rendered
import MenuBar from './widgets/menubar';
import TabArea from './widgets/tabarea';

function App() {
  return (
    <div className="App">
      <MenuBar />
      <TabArea />
    </div>
  );
}

export default App;
