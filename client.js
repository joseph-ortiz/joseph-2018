var exec = require('child_process').exec;
var myargs = process.argv.slice(2);
switch(myargs[0]){
    case 'adduser':
        var username = myargs[1];
        var password = myargs[2];
        exec(`curl --header "Content-Type: application/json" \
            --request POST \
            --data '{"username":"${username}","password":"${password}"}' \
            http://localhost:3001/addUser`, function(err,stdout,stderr){
            console.log('add user callback');
        })
    break;
    case 'addprivatekey':
        var username = myargs[1];
        var password = myargs[2];
        var publickeyfilepath = myargs[3];
        exec(`curl --header "Content-Type: multipart/form-data" \
        --header 'Authorization: ${username}:${password}' \
        --request POST \
        -F "file=@${publickeyfilepath}" \
        http://localhost:3001/addPrivateKey`, function(err,stdout,stderr){
            console.log('addprivatekey callback');
        })
    break;
    case 'addprivatekey':
        var username = myargs[1];
        var password = myargs[2];
        var publickeyfilepath = myargs[3];
        exec(`curl --header "Content-Type: multipart/form-data" \
        --header 'Authorization: ${username}:${password}' \
        --request POST \
        -F "file=@${publickeyfilepath}" \
        http://localhost:3001/addPrivateKey`, function(err,stdout,stderr){
            console.log('addprivatekey callback');
        })
    break;
    case 'addpublickey':
        var username = myargs[1];
        var password = myargs[2];
        var filepath = myargs[3];
        exec(`curl --header "Content-Type: multipart/form-data" \
        --header 'Authorization: ${username}:${password}' \
        --request POST \
        -F "file=@${filepath}" \
        http://localhost:3001/addPublicKey`, function(err,stdout,stderr){
            console.log('addPublicKey callback');
        })
    break;
    case 'signwithkey':
        var username = myargs[1];
        var password = myargs[2];
        var targetUsername = myargs[3];
        var message  = myargs[4];
        exec(`curl --header "Content-Type: application/json" \
        --header 'Authorization: ${username}:${password}' \
        --request POST \
        --data '{"targetUsername":"${targetUsername}", "message": "${message}"}' \
        http://localhost:3001/signwithkey`, function(err,stdout,stderr){
            console.log('signwithkeyx callback');
            console.log(stdout);
        })
    break;
    default:
    console.log('this is not a recognized command');
    break;
}

