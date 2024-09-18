![image](https://bitbucket.esolutions.ro/users/alexandru.crihan/repos/das-micro-server/raw/documentation_resources/banner.jpg)

---

# Das Micro Server (dms)
`Das Micro Server` `(dms)` is file system driven http server used for handling multiple responses for the
same url resource by mocking responses based on request number on the same path.

---

## Demo

![image](https://bitbucket.esolutions.ro/users/alexandru.crihan/repos/das-micro-server/raw/documentation_resources/demo.gif)

---

# Usage
```
dms.js [-p] [-t] directory
```
| Parameter | Default | Description
| --- | --- | --- |
| -p | 8081 | Running port, if value is 0 it will look for an open port
| -t | 2000 | Time in ms between counter reset
| directory | - | The root directory where the server will search

While the application is running for each inbound request it will test 
to see if any `requestHandler` is applicable

Currently available request handlers are (in order of execution)

| No | Name | Description
| --- | --- | --- | 
| 0 | GraphqlSingleOperationRequestHandler | Interprets graphql request by checking: <ul><li>if request is a valid graphql query by parsing the query </li><li> if there is a <strong> single named operation </strong> </li><li>If a subdirectory named `#gqlSingleOperation` exists</li>
| 1 | HttpRequestHandler | Is applicable to any request

---

# Handlers usage

## Http Request handler 

To use http request handler for serving a payload a folder hierarchy
must exist so that using the path from `directory` as a resource map for
the request (Ex: `[...]/serverRoot/myResource` would serve any requests
to `myResource`)

*Note that the request path is being tested against the regex created
from the folder path replacing `#_` with `*` that starts from `directory` using pathToRegexp
version 0.1.7 Ex:( `[...]/serverRoot/any#_` would serve `/any` `/anything` `/any/subchild`)

Inside that folder it will try to read using the following `resourceReaders`
in order where `index` is the counter for the current <strong>request path</strong>

| No | Name | Description
| --- | --- | --- | 
| 0 | shellResourceReader | Try to run `[index].sh` read the resource from the process stdio
| 1 | httpResourceReader | Try to read the resource from `[index].http`
| 2 | shellUnderscoreResourceReader | Try to run `_.sh` disregarding the current index and read the resource from the process stdio
| 3 | httpUnderscoreResourceReader | Try to read the resource from `_.http` disregarding the current index

Then those resources are transformed into payloads.

---

## Graphql Single Operation Request Handler

To use Graphql Single Operation Request Handler for serving a payload a folder hierarchy
must exist so that using the path from `directory` as a resource map for
the request (Ex: `[...]/serverRoot/myResource` would serve any requests
to `myResource`)

*Note that the request path is being tested against the regex created
from the folder path that starts from `directory` using pathToRegexp
version 0.1.7 Ex:( `[...]/serverRoot/any*` would serve `/any` `/anything` `/any/subchild`)


A subfolder named `#gqlSingleOperation` is expected, so that it will try to
find based on
* `operationName` request field if exists 
  Ex ( for the operationName `op` and query `query QueryName {...}` for the path `/myResource` 
  it will seek `[...]/serverRoot/myResource/#gqlSingleOperation/op` directory)

* name of the operation, only if one is present
  Ex( for the query `query QueryName {...}` for the path `/myResource`
  it will seek `[...]/serverRoot/myResource/#gqlSingleOperation/QueryName` directory)



Inside that folder mapped by that query it will try to read using the following `resourceReaders`
in order where `index` is the counter for the current <strong>request path</strong>

| No | Name | Description
| --- | --- | --- | 
| 0 | shellResourceReader | Try to run `[index].sh` read the resource from the process stdio
| 1 | httpResourceReader | Try to read the resource from `[index].http`
| 2 | shellUnderscoreResourceReader | Try to run `_.sh` disregarding the current index and read the resource from the process stdio
| 3 | httpUnderscoreResourceReader | Try to read the resource from `_.http` disregarding the current index

Then those resources are transformed into payloads.

---


# Payloads
Are differentiated by the first text token.
### 1. HTTP/1.1

---

Sets the response according to the file contents.

```
HTTP/1.1 STATUS_CODE [STATUS MESSAGE]
[HEADER]

[BODY]
```

| Token | Required | Description |
|---|---|---|
| HTTP/1.1 | * | Marks resource to be used as a response
| STATUS_CODE | * | Returned status code, if not set it will return `599`
|STATUS_MESSAGE| | Overwrite status message, if not set will use [express](https://github.com/expressjs/express) [default](https://www.npmjs.com/package/statuses)
|HEADER| |Sets the response headers for this response, and overwrites if already exists,<br> an empty line signals the end of header declarations <br> Syntax: `HEADER_NAME: HEADER_VALUE`
|BODY| |Sets the response body, and <strong>it must be preceded by an empty line!</strong>

Ex:
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
access-control-allow-origin: *

 <!DOCTYPE html>
<html>
<body>
<h1>My First Heading</h1>
<p>My first paragraph.</p>
</body>
</html> 
```


### 2. FORWARD

---

Makes a request on the given url <strong>using the method of the original request</strong>
with the options of overwriting the request (towards the forwarded url) and response (towards this server response).

```
PROXY [URL]

REQUEST
[requestHeaders]

RESPONSE
[responseHeaders]
```

| Token | Required | Description | 
|---|---|---|
| FORWARD | * | Marks resource to be used to make a forward request
| URL | * | The destination at which the request be forwarded to
| REQUEST |  | The start of Request headers <br> an empty line signals the end of header declarations <br> Syntax: `HEADER_NAME: HEADER_VALUE` <br><strong>Must be preceded by an empty line</strong> <br><strong>Must be before `RESPONSE` keyword</strong>
| RESPONSE |  | The destination at which the request be forwarded to <br> an empty line signals the end of header declarations <br> Syntax: `HEADER_NAME: HEADER_VALUE` <br><strong>Must be preceded by an empty line</strong>  <br><strong>Must be after `REQUEST` keyword if exists</strong>
Example: forwards requests to [motherfuckingwebsite](https://motherfuckingwebsite.com/)
adding requestHeader1 and requestHeader2 to request header <br>
and adding header1 and header2 to that response's header.
```
FORWARD https://motherfuckingwebsite.com/

REQUEST
requestHeader1:value1
requestHeader2:value2

RESPONSE
header1:value1
header2:value2
```
