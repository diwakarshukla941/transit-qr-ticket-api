const mongoose = require("mongoose");
const dbConnect = async () => {
     mongoose.connect(process.env.MONGO_URI) 
     .then((result:any) => { console.log(`Connection Established Successfully`)
     })
     .catch((err:any) => { 
        throw new Error(`Something Went Wrong , ${err}`); 
    });
}