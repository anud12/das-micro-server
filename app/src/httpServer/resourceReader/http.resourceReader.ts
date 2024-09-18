import {ResourceReader} from "./_resourceReader";

export const httpResourceReader: ResourceReader = async args => {

  const resource = args.directory.read(`${args.index}.http`)

  if(!resource) {
    return [undefined, {
      statusMessage: `httpResourceReader: No usable files found for ${args.req.path}`
    }]
  }
  return [resource]
}