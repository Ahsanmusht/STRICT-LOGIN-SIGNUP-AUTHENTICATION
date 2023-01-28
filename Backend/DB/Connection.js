const mongoose = require("mongoose");

mongoose.set('strictQuery' , false);

const db="mongodb+srv://AhsanMushtaq:3102007KPH0740@skdigitech.2mluozs.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(db , { useNewUrlParser: true, useUnifiedTopology : true})
mongoose.connection.on("connected", () => {
  console.log("mongoose connected sucessfully");
})
mongoose.connection.on("disconnected", () => {
  console.log("mongoose not connected sucessfully");
  process.exit(1);
});
