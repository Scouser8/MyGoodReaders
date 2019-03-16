const express = require("express");
const mongoose = require("mongoose");
const adminRout = require("./routes/adminRout");
const categoryRout = require("./routes/categRout");
const userRout = require("./routes/userRout");
const cors = require('cors');
const path= require("path");
mongoose.connect('mongodb://localhost:27017/bookDB', () => {
    console.log("connected to database");
})



const app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
app.use(express.urlencoded());
app.use(express.json({
    type: ['application/json', 'text/plain']
  }));

app.use("/admin", adminRout);
app.use("/category", categoryRout);
app.use("/user", userRout);



app.listen(3000);
