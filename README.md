# sdevpn
web app to manipulate evpns within cisco nexus fabrics  
It consists of backend and frontend  

backend speaks to a fabric by means of NETCONF protocol  
while frontend speaks to backend with REST API

Backend is a python application that uses scraply_nornir and scraply_netconf libraries for northbound communication  
and fastAPI framework for the southbound (REST API) one

While frontend is a typical SPA app written in React.js

## deployment
To deploy the application ...
