const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); //all the http req inside the console
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// const axios = require('axios')

/**imporoted */
const connect = require('./config/db.cofig')
const router = require('./routes/route')

const app =express()

dotenv.config({
    path:'.env'
})

/**middleware */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack
app.use('/api',router)
app.use(cors({
    origin:'http://localhost:3000'
  }))



/**start server only when have valid connection  */
try{
    app.listen(process.env.PORT,()=>{
            console.log(`connected at http://localhost${process.env.PORT}`);
    })
} catch (err){
    
   console.log("cannot connect a server");
}


