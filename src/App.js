import './App.css';
import axios from 'axios';
import MessageBox from './components/MessageBox';
import Login from './components/Login';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function App() {
  const [chats, setChats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newSenderPhone, setNewSenderPhone] = useState('');
  const [messageText, setMessageText] = useState("");
  const [addUserBlock, setAddUserBlock] = useState(false);
  const [newUserPhoneNumber, setNewUserPhoneNumber] = useState('');
  const [idInstance, setIdInstance] = useState(() => localStorage.getItem("idInstance") || "");
  const [apiTokenInstance, setApiTokenInstance] = useState(() => localStorage.getItem("apiTokenInstance") || "");
  const [isAuthorized, setIsAuthorized] = useState(() => JSON.parse(localStorage.getItem("isAuthorized")) || false);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("myContacts")) || []);
  const toast = useRef(null);

  const showInfo = () => {
    toast.current.show({severity:'info', summary: newSenderPhone, detail: newMessage, life: 3000});
  }
  
  const currentMessages = selectedUser ? chats[selectedUser] || [] : [];
  const processedMessages = useRef(new Set());
  
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
    localStorage.setItem('myContacts', JSON.stringify(users))
  }, [users]);

  /** Уведомление при получении нового сообщения */
  useEffect(() => {
    if (newMessage === '') {
      return
    }
    showInfo();
  }, [newMessage])

  useEffect(() => {
    const interval = setInterval(() => {
      getMessage();
    }, 5000);
    return () => clearInterval(interval);
  }, [getMessage]);

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

  function getMessage() {
    const getMessageUrl = `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`;
  
    const deleteMessageUrl = (receiptId) =>
      `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
  
    apiClient
      .get(getMessageUrl)
      .then((response) => {
        if (response.data) {
          // console.log(response.data);
          const { senderData, messageData } = response.data.body;
  
          const senderPhone = senderData?.sender?.split("@")[0]; // Извлекаем номер без @c.us
          const textMessage = messageData?.textMessageData?.textMessage;
          const receiptId = response.data.receiptId;

          if (processedMessages.current.has(receiptId)) {
            console.log("Сообщение уже обработано:", receiptId);
            return;
          }

          // Добавляем ID в обработанные сообщения
          processedMessages.current.add(receiptId);

          if (!receiptId) {
            console.error("receiptId отсутствует в ответе сервера.");
            return;
          }

          // Удаляем уведомление, даже если оно от неизвестного номера
          apiClient
            .delete(deleteMessageUrl(receiptId))
            .then(() => {
              console.log(`Уведомление с ID ${receiptId} успешно удалено.`);
            })
            .catch((error) => {
              console.error("Ошибка при удалении уведомления:", error);
            });

          // Проверяем, есть ли номер в списке users
          const isUserInContacts = users.some((user) => user.number === senderPhone);
  
          if (isUserInContacts && textMessage) {
            console.log("Получено сообщение от пользователя:", senderPhone);
            setNewMessage(textMessage);
            setNewSenderPhone(senderPhone);
  
            // Добавляем сообщение в чат
            addMessage(senderPhone, {
              sender: senderData.senderName || "Unknown",
              text: textMessage,
            });
            // Удаляем уведомление после обработки
            // if (receiptId) {
            //   console.log(`Попытка удалить уведомление с ID: ${receiptId}`);
            //   apiClient
            //     .delete(deleteMessageUrl(receiptId))
            //     .then(() => {
            //       console.log(`Уведомление с ID ${receiptId} успешно удалено.`);
            //     })
            //     .catch((error) => {
            //       console.error(`Ошибка при удалении уведомления с ID ${receiptId}:`, error);
            //     });
            // }
          } else {
            console.warn("Сообщение не от пользователя из списка:", senderPhone);
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

  // const handleSendMessage = () => {
  //   if (!selectedUser || !messageText.trim()) return;

  //   const newMessage = { sender: "me", text: messageText };
  //   addMessage(selectedUser, newMessage);
  //   setMessageText("");
  // };

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
          <Toast ref={toast} />
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
            className='absolute bottom-0 left-0 m-4'
            rounded
            placeholder="Right"
            tooltip="Выйти из аккаунта"
            onClick={() => {
              setIsAuthorized(false);
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
