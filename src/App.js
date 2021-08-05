import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lobby from './components/Lobby';
import { useState } from 'react';
import Chat from './components/Chat';
import { hubConnection } from 'signalr-no-jquery';


const App = () => {
  const [connection, setConnection] = useState();
  const [proxy, setProxy] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const joinRoom = async (user, room) => {
    try {
      
      const connection = hubConnection('http://localhost:65024');
      connection.logging = true;
      const proxy = connection.createHubProxy('ChatHub');

      proxy.on("ReceiveMessage", (user, message) => {
        setMessages(messages => [...messages, { user, message }]);
      });

      proxy.on("UsersInRoom", (users) => {
        setUsers(users);
      });

      connection.disconnected(() => {
        setConnection();
        setMessages([]);
        setUsers([]);
      });

      const something = connection.start();
      console.log(something);
      
      something
        .done(() => {
          console.log(`Connected with Id: ${connection.id}`);
          proxy.invoke('JoinRoom', { User: user, Room: room });
          setConnection(connection);
          setProxy(proxy);
        })
        .fail(() => { console.log('Could not connect'); });
    }
    catch (e) {
      console.log(e);
    }
  }

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  }

  const sendMessage = async (message) => {
    try {
      proxy.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  }

  return <div className='app'>
    <h2>Chato</h2>
    <hr className='line' />
    {
      !connection ?
        <Lobby joinRoom={joinRoom} /> :
        <Chat messages={messages} sendMessage={sendMessage} closeConnection={closeConnection} users={users} />
    }
  </div>
}

export default App;
