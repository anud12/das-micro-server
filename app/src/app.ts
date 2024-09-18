import {Command} from "commander";
import {parseApplicationArguments} from "./parseApplicationArguments";
import {createHttpServer} from "./httpServer/createHttpServer";
import {FSDirectory} from "./fs/FSDirectory";


const program = new Command()
  .arguments('<directory...>')
  .option("-p --port <value>", "Listening port for incoming connections")
  .option("-t --timer <value>", "Reset timer ms")
  .option("-uilog --enable-log-ui ", "Enable log ui")
  .parse();

process.on('SIGINT', function () {
  process.exit();
});
const commandArguments = parseApplicationArguments(program);
void createHttpServer({
  timer: commandArguments.timer,
  port: commandArguments.port,
  directory: new FSDirectory(commandArguments.path),
  enableLogUi: commandArguments.uilog,
});