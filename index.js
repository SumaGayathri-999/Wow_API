let express = require('express')
let app = express();
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 3000;
let mongourl = process.env.LiveMongo;
const cors = require("cors");
app.use(cors());
const AuthController =  require('./controllers/AuthController');
const ProductsController = require('./controllers/ProductsController')


app.use('/api/auth',AuthController);
app.use('/productinfo',ProductsController);



app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Credentials",true);
    res.setHeader("Access-Control-Allow-Methods",'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers",'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
})
//mongoose connection with mongodb
let mongoose = require('mongoose');
mongoose.connect(mongourl);

app.listen(port,()=>{
                console.log("lisening")
            })
