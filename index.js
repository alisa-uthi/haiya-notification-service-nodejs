const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connection = require('./config/database')
const app = express()

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
    app.use(morgan('dev'))
}

// Connect to database
connection

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Routes
app.use('/', require('./routes/notification_route'))
app.use('/subscription', require('./routes/subscription_route'))


const PORT = process.env.PORT || 8005

app.listen(PORT, () => {
    console.log(`Notification Service listening on ${PORT}`)
})
