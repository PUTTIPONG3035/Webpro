
const express = require('express')


const app = express()

const path = require('path')

// Setup ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup static path
app.use(express.static(path.join(__dirname, 'public')))

// Config Router
const indexRouter = require('./routers/index')
const blogRouter = require('./routers/blog')

app.use('/', indexRouter)
app.use('/blog', blogRouter)

// กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

// app.get('/blogapi', (req, res) => {
//     res.json(article)
//     console.log(req.query)
//   })
  
//   // กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด
  
//   app.get('/blogapi/:article_id/:name', (req, res) => {
 
//     res.json(article.find(article => article.id === req.params.article_id))
//   })
app.get('*', function(req, res){
  res.send('error')
})

app.listen(3000, () => {
  console.log('Start server at port 3000.')
})
