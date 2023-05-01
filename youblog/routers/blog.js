const express = require('express')
const router = express.Router()
const article = require('../article-db')
// กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

router.get('/blogapi', (req, res) => {
    var data = {
        title: 'All Blogs',
        article: article
    }
    res.render('blog_list', data)
    console.log(req.query)
  })
  
  // กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด
  
  router.get('/blogapi/:article_id', (req, res) => {

    var data = {article : article.find(article => article.id === req.params.article_id)}

 
     
        res.render('detail', data)
      


  
  })

  module.exports = router  
