

let mongoose = require('mongoose');

let mongoDB = 'mongodb+srv://shifananazrin15:0ctm8awrLcVNPqr5@cluster0.jzhivcm.mongodb.net/<your-database-name>';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
      
          console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = { connectDB };