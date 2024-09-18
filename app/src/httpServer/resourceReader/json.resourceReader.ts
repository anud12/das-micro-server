import {ResourceReader} from "./_resourceReader";

export const jsonResourceReader: ResourceReader = async args => {
  const resource = args.directory.read(`${args.index}.json`)

  if(!resource) {
    return [undefined, {
      statusMessage: `jsonResourceReader: No usable files found for ${args.req.path}`
    }]
  }
  return [resource]
}