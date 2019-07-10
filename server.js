var crypto = require('crypto');
var bcrypt = require('bcrypt');
var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', function(req,res){
    res.send('please login to make a request');
});

app.post('/addUser', function(req, res) {
    var bodyJSON = req.body;
    console.log(req.body);
    if(bodyJSON["username"] && bodyJSON["password"]){
        var username = bodyJSON["username"];
        var password = bodyJSON["password"];
        server.addUser(username,password).then(() => {
            res.send('user added');
        });
    }
});

app.post('/addPublicKey', function(req, res, next) {
    
    console.log('in public key endpoint');
    console.log(req.body);
    
    //verify authorization header is found.
    if(!req.headers.authorization){
        res.send('please pass auth header with username password. For example, authorization: abc:123');
    }
    let [username,password] = req.headers.authorization.split(':');
    if(!server.validUser(username, password)){
        res.send('invalid username and password');
    }else{
        let userIndex = server.getUserIndex(username);
        if(userIndex >= 0){
            let publicKey = req.files.file.data.toString('utf8');
            server.users[userIndex].publicKey = publicKey;
            console.log(server.users);
        }else{
            console.log('no user found');
        }
        res.end();
    }
});

app.post('/addPrivateKey', function(req, res, next) {
    
    console.log('in prvate key endpoint');
    console.log(req.body);
    //authorize user.
    if(!req.headers.authorization){
        res.send('please pass auth header with username password. For example, authorization: abc:123');
    }
    let [username,password] = req.headers.authorization.split(':');
    if(!server.validUser(username, password)){
        res.send('invalid username and password');
    }else{
        let userIndex = -1;
        server.users.find((user, index) => {
            let usernameMatches = user.username == username;
            if(usernameMatches){
                console.log('username matches');
                userIndex = index;
                return true;
                
            }else{
                console.log(user);
                console.log(username);
            }
        });
        if(userIndex >= 0){
            let privateKey = req.files.file.data.toString('utf8');
            console.log(privateKey);
            server.users[userIndex].privateKey = privateKey;
        }else{
            console.log('no user found');
            //console.log(server.users);
        }
        res.end();
    }
});

app.post('/signwithkey', function(req,res){
    var crypto = require('crypto');
    var pem;
    console.log('in /signwithkey');
    let [username,password] = req.headers.authorization.split(':');
    let targetUsername = req.body["targetUsername"];
    let message = req.body["message"];
    console.log(req.body);
    console.log(targetUsername);
    console.log(message);
    if(!server.validUser(username, password)){
        res.send('invalid username and password');
    }else{
        let userIndex = -1;
        server.users.find((user, index) => {
            let usernameMatches = user.username == targetUsername;
            if(usernameMatches){
                console.log('username matches');
                userIndex = index;
                return true;
                
            }else{
                console.log(user);
                console.log(username);
            }
        });
        if(userIndex >= 0){
            //let publicKey = req.files.file.data.toString('utf8');
            //server.users[userIndex].publicKey = publicKey;
            var privateKey;
            //var privateKey = '123';//server.users[userIndex].privateKey;
            var privateKey = fs.readFileSync('key.pem', 'utf-8');
            if(privateKey){
                const signer = crypto.createSign('sha256');
                signer.update(message);
                signer.end();
              //  privatekey = fs.readFileSync('key.pem', 'utf-8');
                const signature = signer.sign(privateKey);
                const signature_hex = signature.toString('hex');
                console.log('message is signed with a private key')
                res.send(signature_hex);
                
            }else{
                res.send('no public key found fo this user');
            }
            
        }else{
            console.log('no user found');
            //console.log(server.users);
        }
        res.end();
    }

    
})

app.listen(3001);
console.log('Listening on port 3001...');

class Server {
    constructor(){
       this.users = [];
    }

    findUser(username){
        return this.users.find( (user) => username == user.username );
    }

    validUser(username, password){
        return this.users.find( (user) => username == username && bcrypt.compare(password,user.hash));
    }

    getUserIndex(username){
        let userIndex = -1;
        this.users.find((user, index) => {
            let usernameMatches = user.username == username;
            if(usernameMatches){
                console.log('username matches');
                userIndex = index;
                return true;
                
            }else{
                console.log(user);
                console.log(username);
            }
        });
        return userIndex;
    }

    addUser(username, serverPassword){
        return new Promise((res,rej) => {
            let usersArray = this.users;  
            const saltRounds = 10;
            bcrypt.hash(serverPassword, saltRounds, function(err, hash){
                if(err) console.error(err);
    
                console.log('password for server has been stored');
                console.log(hash);
                
                let userIndex;
                
                usersArray.find((user, index) => {
                    if(user.username == username){
                        userIndex = index;
                    }
                });
                
                if(userIndex){
                    usersArray[userIndex].hash = hash;
                }else{
                    usersArray.push({
                        username,
                        hash
                    });
                   
                }
                res();
            });
        })
        
    }

    authenticate(password){
        //return bcrypt.compare(password, this.hash);
    }

    storePublicKey(username,pasword, publicKey){
        //store public key for user.
        var self = this;
        authenticate(username,password).then(function(err,res){
            if(res == true){
                console.log('Authentication success');
                self.users[username].publicKey = publicKey;
            }else{
                console.log(err);
            }
        })
        
    }

    encryptStringWithRsaPublicKey (toEncrypt, publicKey) {
        var buffer = Buffer.from(toEncrypt);
        var encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    }

    submitMessage(signedMessage){
        //verify message
    }
    
}
var server = new Server();



