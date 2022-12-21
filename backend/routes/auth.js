const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET='Mohitisagoodboy';
//Route1:Create a user using:Post "/api/auth/createuser".No login require
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success=false;
    //if there are error return bad request and error
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
      }
    
    try {
      
      //check wether if user is exist with same email
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "A user with this email already exist" });
      }
      const salt=await bcrypt.genSalt(10);
      const secPassword= await bcrypt.hash(req.body.password,salt);
      //Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });
     const data={
      user:{
        id:user.id
      }
     }
      const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
      res.json({success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occured");
    }
  }
);

//Route2:Authenticate a user using:Post "/api/auth/login".No login require
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success=false;
      //if there are error return bad request and error
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     const{email,password}=req.body;
      try {
        let user =await User.findOne({email});
        if(!user){ 
          success=false;
          return res.status(400).json({error:"Please try to login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
          success=false
          return res.status(400).json({error:"Please try to login with correct credentials"})
        }
        const data={
          user:{
            id:user.id
          }
         }
          const authtoken=jwt.sign(data,JWT_SECRET);
         success=true;
          res.json({success,authtoken});
      } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal error occured");
      }
      })
    
//Route3:Get login user details:Post "/api/auth/getuser". login require
router.post("/getuser",fetchuser,async (req, res) => {
try {
 const userId=req.user.id;
  const user =await User.findById(userId).select("-password")
  res.send(user);
} catch (error) {
  console.error(error.message);
      res.status(500).send("Internal error occured");
}  
  })
module.exports = router;
