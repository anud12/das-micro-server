#!/bin/bash

echo "
HTTP/1.1 500 Not Found
Date: Sun, 18 Oct 2012 10:36:20 GMT
Server: Apache/2.2.14 (Win32)
Content-Length: 230
Connection: Closed

ceva ceva something
urmatoarea line"

echo $1
echo -n $2