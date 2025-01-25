import { ListBox } from 'primereact/listbox';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MessageBox from './components/MessageBox';
import Login from './components/Login';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  // const MemoizedComponent = memo(SomeComponent, arePropsEqual?)

  // useEffect(() => {
  //   axios.get('https://webhook.site/token/6488ba44-6dbb-4857-bf4e-e890770e298f/request/18195bd5-55b6-421e-8cc1-97d80f7aaafc/raw')
  //     .then(res => console.log(res.data))
  //     .catch(err => console.log(err));
  // });

  const getMessage = () => {
    axios.get('{{apiUrl}}/waInstance{{idInstance}}/receiveNotification/{{apiTokenInstance}}')
    .then(res => console.log(res)).catch(err => console.log(err));
  };

  const apiClient = axios.create({
    baseURL: 'https://7103.api.greenapi.com',
    headers: { 'Content-Type': 'application/json' },
  });

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const postMessage = () => {
    // const url = `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const url = `/waInstance7103180619/sendMessage/4762252879ff4adda5b19503505111aac063d8cb7d18450f9d`;
    const data = {
      chatId: '77021713398@c.us',
      message: value,
    };

    apiClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        addMessage({ sender: 'me', text: value });
        setValue('');
      })
      .catch((error) => console.error('Error:', error));
  };

  // const postMessage = () => {
  //   // The apiUrl, idInstance and apiTokenInstance values are available in console, double brackets must be removed
  //   const url = `https://7103.api.greenapi.com/waInstance7103180619/sendMessage/4762252879ff4adda5b19503505111aac063d8cb7d18450f9d`;

  //   // chatId is the number to send the message to (@c.us for private chats, @g.us for group chats)
  //   const data = {
  //     chatId: '77021713398@c.us',
  //     message: value
  //   };

  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   };

  //   fetch(url, options)
  //     .then(response => response.json())
  //     .then(responseData => console.log(responseData))
  //     .catch(error => console.error('Error:', error));
  // };

  const users = [
    { name: 'Адиль', number: '+7 777 123 23 23' },
    { name: 'Максим', number: '+7 777 321 32 21' },
    { name: 'Крис', number: '+7 777 222 77 22' },
    { name: '+7 777 444 55 44', number: '+7 777 444 55 44' }
  ];

  const idInstanceInputHandler = (e) => {
    setIdInstance(e.target.value);
  }
  const apiTokenInputHandler = (e) => {
    setApiTokenInstance(e.target.value);
  }
  const onListboxChangeHandler = (e) => {
    setSelectedUser(e.value);
  }
  const onInputChangeHandler = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className="flex w-12 py-3 h-screen align-items-center justify-content-center">
      { isAuthorized ? (
        <MessageBox
          selectedUser={selectedUser}
          messages={messages}
          users={users}
          value={value}
          onListboxChangeHandler={onListboxChangeHandler}
          onInputChangeHandler={onInputChangeHandler}
          postMessage={postMessage}
        /> 
      ) : (
        <Login
          idInstance={idInstance}
          apiTokenInstance={apiTokenInstance}
          idInstanceInputHandler={idInstanceInputHandler}
          apiTokenInputHandler={apiTokenInputHandler}
        />
      )}
    </div>
  );
}

export default App;
