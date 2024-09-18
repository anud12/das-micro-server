import {RequestHandler} from "../requestHandler.type";
import {resourceReader} from "../../resourceReader/_resourceReader";
import {resourceToPayload} from "./resourceToPayload/_resourceToPayload";
import {shellResourceReader} from "../../resourceReader/shell.resourceReader";
import {httpResourceReader} from "../../resourceReader/http.resourceReader";
import {shellUnderscoreResourceReader} from "../../resourceReader/shellUnderscore.resourceReader";
import {httpUnderscoreResourceReader} from "../../resourceReader/httpUnderscore.resourceReader";


export class HttpRequestHandler implements RequestHandler {

  launchDescription: RequestHandler["launchDescription"] = () => "Http Request handler: \t\t\t -/-"

  counters = {} as Record<string, number>
  resetCounters: RequestHandler["resetCounters"] = () => {
    this.counters = {};
  };
  getCounters: RequestHandler["getCounters"] = () => {
    return this.counters;
  };

  isConsumable: RequestHandler["isConsumable"] = async () => true
  consume: RequestHandler["consume"] = async (request, args, httpServerHandlerLogger) => {

    const counter = this.counters[request.path] ?? 0;
    this.counters[request.path] = 1 + counter;
    const httpRequestHandlerLogger = httpServerHandlerLogger.createHttpRequestHandlerLogger();
    httpRequestHandlerLogger.start({
      counter:counter,
      path: request.path.toString()
    })
    const resourceDirectory = args.rootDirectory.findMatchingPath(request.path)
    httpRequestHandlerLogger.addResourcePath(resourceDirectory.relativePath())
    const [resource, error] = await resourceReader([
        shellResourceReader,
        httpResourceReader,
        shellUnderscoreResourceReader,
        httpUnderscoreResourceReader,
      ],{
      directory: resourceDirectory,
      req: request,
      index: counter,
    });
    if (error) {
      const statusMessage = `Failed to use any resourceReaders for ${request.path}`;
      httpRequestHandlerLogger.addError({
        requestPath: request.path,
        statusMessage: statusMessage
      })
      return [undefined, {
        statusMessage
      }];
    }
    return await resourceToPayload(resource, resourceDirectory, request, httpRequestHandlerLogger);
  }


}