const express = require("express");
const path = require("path")
const pool = require("../config");

router = express.Router();

// For tutorial 1
router.post("/blogs/addlike/:blogId", async function (req, res, next) {
  // Your code here

  try{
    const [rows, fields] = await pool.query("SELECT * FROM blogs WHERE id=?", [req.params.blogId])

    console.log('Selected blogs = ', rows)

    let likeNum = rows[0].like
    console.log('like num = ', likeNum)

    likeNum += 1

    const [row2, fields2] = await pool.query("UPDATE blogs SET blogs.like=? WHERE blogs.id=?", [likeNum, req.params.blogId])
    res.redirect('/')

  } catch(err){
    return next(err)
  }
});

// For tutorial 2
router.get("/", async function (req, res, next) {
  // Your code here
  
});

// For inserting new blog
router.post("/create", async function (req, res, next) {
  // Your code here
});

// For blog detail page
router.get("/detail/:blogId", function (req, res, next) {
  // Your code here
});

// For updating blog
router.put("/update/:blogId", function (req, res) {
  // Your code here
});

// For deleting blog
router.delete("/delete/:id", function (req, res) {
  // Your code here
});

exports.router = router;
