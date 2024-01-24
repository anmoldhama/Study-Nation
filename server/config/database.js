const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("db connected successfully");
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
};

module.exports = dbConnect;