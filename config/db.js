const mongoose = require('mongoose')

const connectDB = () => mongoose.connect('mongodb+srv://rifsadam81_db_user:DJIkK4t0mpi5ayRt@cluster0.t5ahysf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('database connected succesfully')
    })
    .catch((error) => {
        console.log(error)
    })
module.exports = connectDB