import './App.css';
import axios from 'axios';
import MessageBox from './components/MessageBox';
import Login from './components/Login';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';

function App() {
  const [chats, setChats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [idInstance, setIdInstance] = useState(() => localStorage.getItem("idInstance") || "");
  const [apiTokenInstance, setApiTokenInstance] = useState(() => localStorage.getItem("apiTokenInstance") || "");
  const [isAuthorized, setIsAuthorized] = useState(() => JSON.parse(localStorage.getItem("isAuthorized")) || false);
  const [addUserBlock, setAddUserBlock] = useState(false);
  const [newUserPhoneNumber, setNewUserPhoneNumber] = useState('');

  const [users, setUsers] = useState([
    { number: '77021713398' },
    { number: '77476371514' },
    { number: '77025510476' },
  ]);
  
  const currentMessages = selectedUser ? chats[selectedUser] || [] : [];
  
  useEffect(() => {
    localStorage.setItem("idInstance", idInstance);
  }, [idInstance]);

  useEffect(() => {
    localStorage.setItem("apiTokenInstance", apiTokenInstance);
  }, [apiTokenInstance]);

  useEffect(() => {
    localStorage.setItem("isAuthorized", JSON.stringify(isAuthorized));
  }, [isAuthorized]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMessage();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const apiClient = axios.create({
    baseURL: 'https://7103.api.greenapi.com',
    headers: { 'Content-Type': 'application/json' },
  });

  const isSending = useRef(false);

  const postMessage = () => {
    if (isSending.current) return;

    isSending.current = true;
    const url = `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const data = {
      chatId: `${selectedUser}@c.us`,
      message: messageText,
    };

    apiClient
      .post(url, data)
      .then((response) => {
        console.log(response.data);
        addMessage(selectedUser, { sender: 'me', text: messageText });
        setMessageText('');
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => {
        isSending.current = false;
      });
  };

  const getMessage = () => {
    // URL для получения сообщения
    const getMessageUrl = `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`;
  
    // URL для удаления уведомления
    const deleteMessageUrl = (receiptId) =>
      `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
  
    // Получение сообщения
    apiClient
    .get(getMessageUrl)
    .then((response) => {
      if (response.data) {
        const messageData = response.data.body.messageData?.textMessageData?.textMessage;
        const receiptId = response.data.receiptId;

        if (messageData && receiptId) {
          console.log("Получено сообщение:", messageData);
          console.log("Идентификатор уведомления:", receiptId);
          console.log("Идентификатор уведомления:", response.data.body.messageData.textMessageData.textMessage);

          // Обновляем состояние с новым сообщением
          addMessage(selectedUser, {
            sender: response.data.body.senderData.senderName || "Unknown",
            text: response.data.body.messageData.textMessageData.textMessage,
          });

          // Удаляем уведомление после успешной обработки
          apiClient
            .delete(deleteMessageUrl(receiptId))
            .then(() => {
              console.log(`Уведомление с ID ${receiptId} успешно удалено.`);
            })
            .catch((error) => {
              console.error("Ошибка при удалении уведомления:", error);
            });
        } else {
          console.warn("Сообщение или ID уведомления отсутствуют в ответе.");
        }
      } else {
        console.warn("Нет новых сообщений.");
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении сообщения:", error);
    });
  };

  const handleLogin = () => {
    if (idInstance && apiTokenInstance) {
      setIsAuthorized(true);
    } else {
      alert("Введите корректные данные для входа!");
    }
  };

  const addMessage = (userId, message) => {
    setChats((prevChats) => ({
      ...prevChats,
      [userId]: [...(prevChats[userId] || []), message],
    }));
  };

  const handleSendMessage = () => {
    if (!selectedUser || !messageText.trim()) return;

    const newMessage = { sender: "me", text: messageText };
    addMessage(selectedUser, newMessage);
    setMessageText("");
  };

  const addUserPhoneNumber = () => {
    setUsers([...users, {number: newUserPhoneNumber}])
    setNewUserPhoneNumber('');
    setAddUserBlock(true);
  }

  const addUserBlockHandler = () => {
    setAddUserBlock(true);
  }
  
  return (
    <div className="flex w-12 py-3 h-screen align-items-center justify-content-center">
      { isAuthorized ? (
        <>
          <MessageBox
            selectedUser={selectedUser}
            users={users}
            value={messageText}
            postMessage={postMessage}
            currentMessages={currentMessages}
            handleUserSelect={phoneNumber => setSelectedUser(phoneNumber) }
            onInputChangeHandler={e => setMessageText(e.target.value) }
            
            addUserBlockHandler={addUserBlockHandler}
            addUserBlock={addUserBlock}
            newUserPhoneNumber={newUserPhoneNumber}
            newUserPhoneNumberChangeHandler={e => setNewUserPhoneNumber(e.target.value) }
            addUserPhoneNumber={addUserPhoneNumber}
          />
          <Button
            icon="pi pi-sign-out"
            severity="help"
            className='absolute bottom-0 right-0 m-4'
            rounded
            onClick={() => {
              setIsAuthorized(false);
              localStorage.removeItem("idInstance");
              localStorage.removeItem("apiTokenInstance");
              localStorage.removeItem("isAuthorized");
            }}
          />
        </>
      ) : (
        <Login
          handleLogin={handleLogin}
          idInstance={idInstance}
          apiTokenInstance={apiTokenInstance}
          setIdInstance={setIdInstance}
          setApiTokenInstance={setApiTokenInstance}
          isAuthorized={() => { setIsAuthorized(true) }}
        />
      )}
    </div>
  );
}

export default App;
