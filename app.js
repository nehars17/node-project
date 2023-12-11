const express = require("express");
const pasth=require("path");
const bcrypts=require('bcrypt');
const mongoose= require('mongoose');
const dotenv= require("dotenv");
const userschema=require("./models/User");
const app = express();

//convert data into json format
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine','ejs');
//static file 
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("login");
})

app.get("/signup", (req,res) => {
    res.render("signup");
})

// Register User
app.post("/signup", async (req,res) => {
    const data = {
    username: req.body.username,
    password: req.body.password
}
//check if user exist?
    const existinguser= await userschema.findOne({username:data.username});
    if (existinguser){
        res.send("User already exist, Please choose a different username.");
    }else{
    //hash the password 
    const saltRounds = 10; // number of salt round for bycrypt
    const hashedPassword = await bcrypts.hash(data.password,saltRounds);
    data.password = hashedPassword; //replace old with hashed password
    const userdata = await userschema.insertMany(data);
    console.log(userdata);
    }
})
app.post("/login", async (req,res)=>{
    try{
        const check = await userschema.findOne({username:req.body.username});
        if (!check){
            res.send("username not found!")
        }
       
    
    const isPasswordMatch= await bcrypts.compare(req.body.password,check.password)
    if (isPasswordMatch){
        res.render("home");
    } else{
        req.send("invalid password");
    }
    }
    catch{
        res.send("Wrong Details!")
    }
    });
dotenv.config();
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connection Successful!"))
.catch((err) => {
    console.log(err)
});



app.listen(process.env.PORT || 5000,() => {
    console.log('Backend server is running!')
});