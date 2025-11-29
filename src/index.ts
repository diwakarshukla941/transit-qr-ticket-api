const express = require("express");
const app = express();
const ticketRoutes = require("./routes/ticket.routes") ;
const fareRoutes = require("./routes/fare.routes") 
const errorHandler = require("./middlewares/errorHandler")
const {connectDB} = require("./config/db");
const PORT = process.env.PORT || 5000 

app.use(express.json());
app.use(errorHandler);
app.use("/api/ticket", ticketRoutes);
app.use("/api/fare", fareRoutes);
connectDB();
app.listen(PORT, () => {
    console.log(`Server Running on http: //localhost:${PORT}`);
 })