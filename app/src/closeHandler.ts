import {CreateHttpServerLogger} from "./httpServer/createHttpServer.logger";

type Listener = () => Promise<CreateHttpServerLogger>
const functionList = [];

const send = async (): Promise<CreateHttpServerLogger> => {
  await Promise.all(functionList.map(value => value()));
  return;
}
const on = (fn: Listener) => {
  functionList.push(fn)
}

export const closeHandler = {
  send,
  on,
}
