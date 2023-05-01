const express = require('express')
const router = express.Router()
var article = require('../article-db')


router.get('/', function(req, res, next) {
    try{

        var search = req.query.search;
        
        // console.log(search.toLowerCase())
    
            var find_article = article.filter(d => {
              
                var title = typeof d.title === 'string' ? d.title.toLowerCase() : ''
                var stitle = typeof search === 'string' ? search.toLowerCase() : ''
        
                if(title.includes(stitle)){
                    return d
                }
                // else {
                //     // res.status(404).json({message : "error"})
                //     throw new Error('fefe')
                // }
                // res.status(404).json("")
                return d.title.includes(search)
            })
    
            
    
        var data = { title: 'Express', article: article, search: search, find_article : find_article}
        res.render('index', data)
    } catch(err){
        res.status(404).json({message : "error"})
    }
})





module.exports = router