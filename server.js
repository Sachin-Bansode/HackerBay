const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const User = require('./db').User;

app.listen(3000,() => {console.log('Listening on Port 3000')});
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.get('/', (req,res) => {
    res.send('status:success');
})

// Below api is not the part of the curriculum.Its just for Learning ppurpose
app.get('/find',(req,res)=> {
    User.findOne({ where: {email: req.body.email, password: req.body.password}}).then(user => {
        res.send(JSON.stringify(user.dataValues.id))
    }).catch((err) => res.status(500).send({
        err
    }))
});


app.post('/signup',(req,res,next) => {
    User.findOne({ where: {email: req.body.email}}).then(user => {
        console.log(user);
        if(user.length >= 1){
            console.log('mail Already exist')
            return res.status(400).json({
              session: user[0].dataValues.id})
        } else{
                bcrypt.hash(req.body.password,10,(err,hash) => {
         
                if(err){
                   
                    return res.status(500).json({
                        error: err
                        
                    });
                } else{
                    User.create({
                        email: req.body.email,
                        password: hash
                    }).then(result => {
                        return res.status(200).json({message:'User Created',session: hash});})
                      .catch(err => {
                          console.log(err);
                         return res.status(501).json({error : err}) })
                    }
            });
          }
})
});

app.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
      .then(user => {
        if (user.length < 1) {
          return res.status(400).json({
            error: "User does not exist"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h "
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              session  : token
            });
          }
          res.status(400).json({
            error: "Invalid Password"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


    

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });


