import './App.css';
import { Button } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Routes , Route} from 'react-router-dom';
import HomePage from './Pages/Homepage';
import ChatPage from './Pages/Chatpage';

function App() {
  return (
    <div className="App">
    <Routes>
    <Route path="/" element= {<HomePage/>}></Route>
    <Route path="/chats" element={<ChatPage/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
