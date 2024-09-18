import {Request} from "express";
import {Directory} from "../../fs/Directory.type";

export type ResourceReader = (args: ResourceArguments) => Promise<ResourceResponse>

export type ResourceResponse =
  | [string]
  | [undefined, ResourceError]

export type ResourceArguments = {
  directory: Directory,
  req: Request,
  index: number,
}
export type ResourceError = {
  body?: string
  statusMessage: string
}

export const resourceReader = async (list: Array<ResourceReader>, args: ResourceArguments): Promise<ResourceResponse> => {
  let response: string;
  let error: ResourceError;

  for (const resourceReader of list) {
    [response, error] = await resourceReader(args)
    if (!error) {
      return [response];
    }
  }
  return [undefined, error]
}