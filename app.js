//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")

mongoose.connect("mongodb+srv://shreyas-hegde:Hello123@cluster0.wbzhy1h.mongodb.net/usersDB")


const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
 

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",async (req,res)=>{
    
    const user=new User({
      email: req.body.username,
      password: req.body.password
    });

    const obj = await user.save();

    console.log(obj);
    if(obj.email==''){
      res.send("OOPS! TRY AGAIN LATER");
    }else{
      res.render("secrets");
    }
});

app.post("/login",async (req,res)=>{
      const loginObj=await User.find({email:req.body.username}).exec();
      console.log(loginObj);
      if(loginObj.length == 0){
        console.log("User doesn't exist please click on register");
        res.redirect("/");
      }else{
          if(loginObj[0].password===req.body.password){
            res.render("Secrets");
          }else{
            console.log("Wrong password please try again");
            res.redirect("/login");
          }
      }


      // User.findOne({email:req.body.username}).exec(function(err,user){
      //   if(!err){
      //     res.render("secrets");
      //   }
      // });



});


app.listen(3000,(req,res)=>{
  console.log("Your server is active on channel 3000");
});
