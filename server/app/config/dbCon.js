const mongoose = require('mongoose')

const dbcon = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        if (con) {
            console.log('Database Connected')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbcon