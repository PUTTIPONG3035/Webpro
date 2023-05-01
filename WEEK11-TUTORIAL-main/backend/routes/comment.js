const express = require("express");
const path = require("path")
const pool = require("../config")

// Require multer for file upload
const multer = require('multer')
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'C:/Users/folk3035/OneDrive/Documents/webpro week2/WEEK11/WEEK11-TUTORIAL-main/myfrontend/public/uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })
const router = express.Router();


// Get comment
router.get('/:blogId/comments',  function(req, res, next){
 
});

// Create new comment
router.post('/:blogId/comments',  upload.single('blog_image'), async function(req, res, next){
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return res.json(error)
    }
    const comment = req.body.comment;
    const BlogId = req.params.blogId
    const image = "/uploads/" + req.file.filename;
    

    const conn = await pool.getConnection()
    // Begin transaction
    await conn.beginTransaction();

    try {
      let results = await conn.query(
        "INSERT INTO comments(comment, blog_id, comment_by_id) VALUES (?, ?, ?)",
        [comment,  BlogId, BlogId]
      )
      const commentId = results[0].insertId;

      await conn.query(
        "INSERT INTO images(comment_id, blog_id, file_path) VALUES(?, ?, ?);",
        [commentId, BlogId, image])

      await conn.commit()
      console.log(file.path)
      console.log(file.filename)
      res.json("success!")
    } catch (err) {
      await conn.rollback();
      res.json(err)
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