Signing with Keys.

Getting Started.

```
npm install
node server.js
```

Prerequisite: generate public and private keys 
In *NIX terminal, generate a ssh using ssh-keygen.
Note sample public and private keysare attached.


```code
//generate a ssh key a keygen
$ ssh-keygen -t rsa
$ ssh-keygen -f keys1.pub -e -m pem > keys1.pem
```

**/addUser** 

description:  provided a username and password, a user is created in memory.

The xample below add a user with a username of "abcdef" and password set to "xyz".

Example

add via node script
```code
 $ node client.js adduser abc 123
 ```

add by calling curl command directly.
```code
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"abcdef","password":"xyz"}' \
  http://localhost:3001/addUser

//add a second user
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz123"}' \
  http://localhost:3001/addUser
```

  
**/addPrivateKey** 

description:  sets the private key for the authenticated user.

```code
$ node client.js addprivatekey abc 123 private.pem  
```
```code
curl --header "Content-Type: multipart/form-data" \
  --header 'Authorization: abcdef:xyz' \
  --request POST \
  -F "file=@private.pem" \
  http://localhost:3001/addPrivateKey

```


**addPublicKey** 

description: adds a public key to the authorized user. Basic Authentication expects username:password combination.

```code
$ node client.js addpublickey abc 123 keys1.pem  
```

```code
curl --header "Content-Type: multipart/form-data" \
  --header 'Authorization: abcdef:xyz' \
  --request POST \
  -F "file=@keys1.pem" \
  http://localhost:3001/addPublicKey
```

**/signwithkey**

description: this endpoint takes JSON data and signs the message for a given targetusername.

Example
```code
$ node client.js signwithkey abc 123 xyz `hi world`
```
```code
curl --header "Content-Type: application/json" \
  --header 'Authorization: xyz:xyz123' \
  --request POST \
  --data '{"targetUsername":"xyz", "message": "Hello World"}' \
  http://localhost:3001/signwithkey
  ```

  

  


  