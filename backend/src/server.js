import express from"express"
const app=express();
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import dbconfig from "./config/db.config.js";
dbconfig();
import authRouter from './routers/auth.router.js'

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));
 

app.use('/auth',authRouter);

const PORT=process.env.PORT || 3000;
app.listen(PORT,(req,res)=>{
    console.log(`  server start http://localhost:${PORT}`);
})