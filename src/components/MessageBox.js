import { Button } from "primereact/button";
import { InputTextarea } from 'primereact/inputtextarea';
import { Menubar } from 'primereact/menubar';
import { InputMask } from 'primereact/inputmask';

const MessageBox = ({
  selectedUser,
  users,
  value,
  handleUserSelect,
  onInputChangeHandler,
  postMessage,
  currentMessages,
  addUserBlock,
  addUserBlockHandler,
  newUserPhoneNumber,
  addUserPhoneNumber,
  newUserPhoneNumberChangeHandler,
}) => {
  
  return (
    <>
      <div className="w-3 h-full bg-indigo-100 font-bold text-center p-4">
        <ul className="m-0 p-0 user-list list-none border-1 surface-border border-round p-3 flex flex-column gap-2 w-full h-full">
          { !addUserBlock ? ( 
          <li
            onClick={addUserBlockHandler}
            className="p-1 cursor-pointer bg-green-100 border-round border-1 border-transparent transition-all transition-duration-200 flex align-items-center justify-content-between border-green-400">
            <div className="flex align-items-center gap-2 p-2">
              <span><i className="pi pi-plus-circle mr-2"></i>Новый контакт</span>
            </div>
          </li>
          ):(
            <>
              <InputMask value={newUserPhoneNumber} onChange={newUserPhoneNumberChangeHandler} mask="79999999999" placeholder="7**********" />
              <div className="flex">
                <Button label="Добавить номер" disabled={ !/\d{11}/g.test(newUserPhoneNumber) } onClick={addUserPhoneNumber} />
              </div>
            </>
          )}
          {users.map((user) => (
            <li
              onClick={() => handleUserSelect(user.number)}
              className={`p-2 cursor-pointer hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200 flex align-items-center justify-content-between ${selectedUser === user.number && 'bg-white-alpha-80'}`}
              key={user.number}>
                <div className="flex align-items-center gap-2 p-2">
                  <span className="font-bold">{user.number}</span>
                </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-7 h-full bg-teal-50 flex align-items-end p-4">
        {
          selectedUser == null ? (
          <div className='w-full h-full flex align-items-center justify-content-center'>
            <h2 className='text-center flex align-items-center'>
              Выберите чат <i className="pi pi-comments ml-2" style={{ fontSize: '2rem' }}></i>
            </h2>
          </div>
          ) : (
          <div className="flex flex-column h-full w-full">
            <Menubar start={<p>{'+'+selectedUser}</p>} end={<Button label="Удалить" icon="pi pi-trash" severity="danger" />} />
            <div className="h-full p-2 overflow-y-scroll">{
              currentMessages.map((msg, index) => (
                <div key={index} className={`mess ${msg.sender === 'me' ? 'my-message' : 'their-message'}`}>
                  {msg.text}
                </div>
              ))
            }</div>
            <div className="p-inputgroup flex align-items-end">
              <InputTextarea
                id="userMessageInput"
                style={{resize: 'none'}}
                className="border-round-left-lg h-3rem"
                value={value}
                onChange={onInputChangeHandler}
              />
              <Button icon="pi pi-send" className="p-button-success h-3rem" onClick={postMessage} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MessageBox;