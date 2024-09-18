#!/bin/bash

echo -n "
HTTP/1.1 300 Not Found
Server: Apache/2.2.14 (Win32)
Date: Sun, 18 Oct 2012 10:36:20 GMT
Content-Length: 230
Connection: Closed
Content-Type: text/html; charset=iso-8859-1

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html>
<head>
   <title>404 Not Found</title>
</head>
<body>
   <h1>Not Found</h1>
   <p>The requested URL /t.html was not found on this server.</p>
</body>
</html>"
