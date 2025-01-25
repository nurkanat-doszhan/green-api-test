import { InputText } from "primereact/inputtext";

const Login = ({idInstance, apiTokenInstance, idInstanceInputHandler, apiTokenInputHandler }) => {
  return (
    <div className="w-10 h-full bg-cyan-100 flex flex-column align-items-center justify-content-center p-4">
      <div className="w-5">
        <div className="flex flex-column w-full gap-2">
          <label htmlFor="idInstance">idInstance</label>
          <InputText
            id="idInstance"
            aria-describedby="username-help"
            value={idInstance}
            onChange={idInstanceInputHandler}
          />
          <small id="username-help">Введите свой idInstance из системы GREEN-API</small>
        </div>
        <div className="flex flex-column w-full gap-2">
          <label htmlFor="apiTokenInstance">apiTokenInstance</label>
          <InputText
            id="apiTokenInstance"
            aria-describedby="username-help"
            value={apiTokenInstance}
            onChange={apiTokenInputHandler}
          />
          <small id="username-help">Введите свой apiTokenInstance из системы GREEN-API</small>
        </div>
      </div>
    </div>
  )
}

export default Login;