const mongoose =require('mongoose');
const mongoUri= "mongodb://localhost:27017/inotebook"

const connectTomongo=()=>{
mongoose.connect(mongoUri,()=>{
    console.log("connected to mongo");
})
}

module.exports = connectTomongo;
