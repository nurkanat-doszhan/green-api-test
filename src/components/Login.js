import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const Login = ({idInstance, apiTokenInstance, setIdInstance, setApiTokenInstance, handleLogin  }) => {
  return (
    <div className="w-10 h-full bg-cyan-100 flex flex-column align-items-center justify-content-center p-4">
      <div className="w-5 border-1 px-4 py-6 bg-cyan-200 border-cyan-400 border-round-2xl">
        <div className="flex flex-column w-full gap-2 mb-3">
          <small id="username-help">Введите свой idInstance</small>
          <InputText
            placeholder="idInstance"
            id="idInstance"
            aria-describedby="username-help"
            value={idInstance}
            onChange={ e => setIdInstance(e.target.value)}
          />
        </div>
        <div className="flex flex-column w-full gap-2">
          <small id="username-help">Введите свой apiTokenInstance</small>
          <InputText
            placeholder="apiTokenInstance"
            id="apiTokenInstance"
            aria-describedby="username-help"
            value={apiTokenInstance}
            onChange={ e => setApiTokenInstance(e.target.value)}
          />
        </div>
        <Button
          label="Войти"
          className="mt-3"
          disabled={!idInstance || !apiTokenInstance}
          onClick={handleLogin}
        />
      </div>
    </div>
  )
}

export default Login;