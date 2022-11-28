const express = require('express')
const app = express()
const port = 8000

app.get('/chat', (req, res) => {

})

app.use(express.static('public'))

app.listen(port, () => {
    
})