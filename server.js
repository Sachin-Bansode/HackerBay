const express = require('express');
const app = express();

app.listen(3000,() => {console.log('Listening on Port 3000')});

app.get('/', (req,res) => {
    res.send('status:success');
})

let requestPayload = 'Welcome To Hacker Bay Course';//It can be any initial string value.Can also be left empty

// Below get api is solely responsible for taking the request payload so that the Post Api can work on it otherwise a Form can also be used to take the input 
// With the below API any random string can be typed in URL and Its value can be retrieved back with the help of last 2 API's
app.get('/Payload/:payload',(req,res) => {
    requestPayload = req.params.payload;
     res.send('Data Saved Successfully');
});

app.post('/data',(req,res)=>{
  res.json({'data' : requestPayload});  
});

app.get('/Data',(req,res) => {
    res.json({'data' : requestPayload});  
});




