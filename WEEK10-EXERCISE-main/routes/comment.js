const express = require("express");
const path = require("path")
const pool = require("../config");

const router = express.Router();
const multer = require('multer')
const fs = require('fs')

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
   const fsC =  fs.existsSync( './static/uploads')
    if (!fsC){
      fs.mkdirSync('./static/uploads')
    }
    callback(null, './static/uploads') // path to save file
  },
  filename: function (req, file, callback) {
    // set file name
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

// Get comment
router.get('/:blogId/comments', function(req, res, next){
});

// Create new comment
router.post('/:blogId/comments', upload.single('comment_image'), async function(req, res, next){
     console.log(req.body)
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
  
    const image = "/uploads/" + req.file.filename
    const comment = req.body.comment
    const BlogId = req.params.blogId
    // const title = req.body.title;
    // const content = req.body.content;
    // const status = req.body.status;
    // const pinned = req.body.pinned;
  
    const conn = await pool.getConnection()
    // Begin transaction
    await conn.beginTransaction();
  
    try {
      const results = await conn.query(
        "INSERT INTO comments(comment, blog_id, comment_by_id) VALUES (?, ?, ?)",
        [comment,  BlogId, BlogId]
      )
      const commentId = results[0].insertId;
  
      await conn.query(
        "INSERT INTO images(blog_id, file_path, comment_id) VALUES(?, ?, ?);",
        [BlogId, image, commentId])
  
      await conn.commit()
      // res.send("sucess")
      res.redirect('/')
    
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      console.log('finally')
      conn.release();
    }
});

// Update comment
router.put('/comments/:commentId', function(req, res, next){
    return
});

// Delete comment
router.delete('/comments/:commentId', function(req, res, next){
    return
});

// Delete comment
router.put('/comments/addlike/:commentId', function(req, res, next){
    return
});


exports.router = router