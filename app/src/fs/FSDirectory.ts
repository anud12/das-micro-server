import child_process from "child_process";
import fs from "fs";
//Import the path matcher that express uses
import pathToRegexp from "path-to-regexp"
import {Directory} from "./Directory.type";


export class FSDirectory implements Directory {
  static fileSystem = fs;
  rootPath:string;
  constructor(private basePath:string, rootPath?: string) {
    this.rootPath = rootPath || basePath;
  }

  absolutePath = () => this.rootPath.replace("#_", "*");
  relativePath = () => this.rootPath.replace(this.basePath, "").replace("#_", "*");
  exists: Directory["exists"] = path => {
    try {
      return FSDirectory.fileSystem.existsSync(`${this.rootPath}/${path}`);
    } catch (e) {
      return false;
    }
  }

  navigateInto: Directory["navigateInto"] = path => {
    path = path.replace("*", "#_")
    if (this.exists(path)) {
      return new FSDirectory(this.rootPath, `${this.rootPath}/${path}`)
    } else {
      return undefined
    }
  }

  findMatchingPath: Directory["findMatchingPath"] = path => {
    try {
      const applicablePath = findApplicablePathByDirectoryNameRegex(this.rootPath, path,  FSDirectory.fileSystem);
      return new FSDirectory(this.rootPath, applicablePath);
    } catch (e) {
      return undefined
    }
  }

  read: Directory["read"] = path => {
    path = path.replace("*", "#_")
    try {
      return FSDirectory.fileSystem.readFileSync(`${this.rootPath}/${path}`, {encoding: "utf-8"})
    } catch (e) {
      return undefined
    }
  }

  run: Directory["run"] = (path, processArguments: unknown) => {
    path = path.replace("*", "#_")
    try {
      if (!this.exists(`${path}`)) {
        return undefined
      }
      FSDirectory.fileSystem.chmodSync(`${this.rootPath}/${path}`, 0o777)
      return child_process.spawnSync(`${this.rootPath}/${path}`, processArguments)
    } catch (e) {
      return undefined
    }

  };

}


const findApplicablePathByDirectoryNameRegex = (absoluteRootPath: string, pathRegex:string, fileSystem:typeof fs): string => {
  return absoluteRootPath + scanRecursive("", absoluteRootPath, pathRegex, fileSystem);
}

const matcherTester = (pathExpresion: string, pathToTest: string) => {
  try {
    const result = pathToRegexp(pathExpresion).test(pathToTest);
    return Boolean(result);
  } catch (e) {
    return pathExpresion === pathToTest;
  }
}

const scanRecursive = (currentPath:string, fsPath:string, requestPath:string, fileSystem:typeof fs): string | undefined => {
  const result = matcherTester(currentPath.replace("#_", "*"), requestPath);
  if (result) {
    return currentPath;
  }
  try {
    let path = fsPath + currentPath;
    //Filter special files to be searched last
    const specialNames = ["#_"];
    const movedToLast = [];
    const filesInPath = fileSystem.readdirSync(path)
      .filter(value => {
        if (specialNames.includes(value)) {
          movedToLast.push(value)
          return false;
        }
        return true;
      });
    const fileList = [...filesInPath, ...movedToLast];
    for (const filesKey of fileList) {
      const value = `${currentPath}/${filesKey}`
      const result = scanRecursive(value, fsPath, requestPath, fileSystem)
      if (result) {
        return result
      }
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
}
