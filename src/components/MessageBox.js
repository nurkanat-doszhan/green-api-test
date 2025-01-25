import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ListBox } from "primereact/listbox";

const MessageBox = ({
  selectedUser,
  messages,
  users,
  value,
  onListboxChangeHandler,
  onInputChangeHandler,
  postMessage
}) => {
  return (
    <>
      <div className="w-3 h-full bg-cyan-300 font-bold text-center p-4">
        <ListBox
          filter
          filterPlaceholder="Поиск"
          id="userList"
          value={selectedUser}
          onChange={onListboxChangeHandler}
          options={users}
          optionLabel="name"
          className="w-full h-full"
        />
      </div>
      <div className="w-7 h-full bg-cyan-100 flex align-items-end p-4">
        {
          selectedUser == null ? (
          <div className='w-full h-full flex align-items-center justify-content-center'>
            <h2 className='text-center flex align-items-center'>
              Выберите чат <i className="pi pi-comments ml-2" style={{ fontSize: '2rem' }}></i>
            </h2>
          </div>
          ) : (
          <div className="flex flex-column w-full">
            <div>
              {messages.map((msg, index) => (
                <p key={index} className={msg.sender === 'me' ? 'my-message' : 'their-message'}>
                  {msg.text}
                </p>
              ))}
            </div>
            <div className="p-inputgroup flex-1">
              <InputText id="userMessageInput" value={value} onChange={onInputChangeHandler} />
              <Button icon="pi pi-send" className="p-button-success" onClick={postMessage} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MessageBox;