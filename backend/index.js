const connectTomongo=require('./db');
const express = require('express')
var cors = require('cors')

connectTomongo();

const app = express()
const port = 5000



app.use(cors())
app.use(express.json())

//Aailable Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


app.listen(port, () => {
  console.log(`iNotebook Backend at listening at http://localhost:${port}`)
})
