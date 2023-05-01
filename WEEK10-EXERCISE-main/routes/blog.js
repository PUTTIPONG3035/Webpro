const express = require("express");
const path = require("path")
const pool = require("../config");
const multer = require('multer')

router = express.Router();

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './static/uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })




router.get("/blogs/search", async function (req, res, next) {
  // Your code here
  try{
    const [rows, fields] = await pool.query("SELECT * FROM blogs WHERE title LIKE ?", [
      `%${req.query.search}%`,
    ]);

    return res.json(rows);

  } catch (err) {
    console.log(err)
    return next(err);
  }
});

router.post("/blogs/addlike/:blogId", async function (req, res, next) {
  //ทำการ select ข้อมูล blog ที่มี id = req.params.blogId
  try{
    const [rows, fields] = await pool.query("SELECT * FROM blogs WHERE id=?", [
      req.params.blogId,
    ]);
    //ข้อมูล blog ที่เลือกจะอยู่ในตัวแปร rows
    console.log('Selected blogs =', rows)
    //สร้างตัวแปรมาเก็บจำนวน like ณ ปัจจุบันของ blog ที่ select มา
    let likeNum = rows[0].like
    console.log('Like num =', likeNum) // console.log() จำนวน Like ออกมาดู
    //เพิ่มจำนวน like ไปอีก 1 ครั้ง
    likeNum += 1

    //Update จำนวน Like กลับเข้าไปใน DB
    const [rows2, fields2] = await pool.query("UPDATE blogs SET blogs.like=? WHERE blogs.id=?", [
      likeNum, req.params.blogId,
    ]);
    //Redirect ไปที่หน้า index เพื่อแสดงข้อมูล
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
});

router.get("/blogs/create", async function (req, res, next) {
  res.render('blogs/create')
});




router.get("/blogs/:id", function (req, res, next) {
  const promise1 = pool.query("SELECT * FROM blogs WHERE id=? ", [
    req.params.id,
  ]);
  // const promise4 = pool.query("SELECT * FROM comments where blog_id = ?",[ req.params.id])

  const promise2 = pool.query("SELECT * FROM comments c left outer join images i on (i.comment_id = c.id) WHERE c.blog_id = ? ", [req.params.id] );

  const promise3 = pool.query("SELECT * FROM images WHERE blog_id = ? and comment_id is null", [
    req.params.id,
  ]);

 



  Promise.all([promise1, promise2, promise3])
    .then((results) => {
      const blogs = results[0];
      const comments = results[1];
      const images = results[2];
      res.render("blogs/detail", {
        blog: blogs[0][0],
        comments: comments[0],
        images : images[0],
        error: null,
      });
    })
    .catch((err) => {
      return next(err);
    });
});



router.post("/blogs",  upload.single('myImage'), async function(req, res, next){
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
 }

 const title = req.body.title;
const content = req.body.content;
const status = req.body.status;
const pinned = req.body.pinned;
const conn = await pool.getConnection()
await conn.beginTransaction();

try {
  let results = await conn.query(
    "INSERT INTO blogs(title, content, status, pinned, `like`,create_date) VALUES(?, ?, ?, ?, 0,CURRENT_TIMESTAMP);",
    [title, content, status, pinned]
  )
  const blogId = results[0].insertId;

  await conn.query(
    "INSERT INTO images(blog_id, file_path) VALUES(?, ?);",
    [blogId, file.path.substr(6)])

  await conn.commit()
  // res.send("success!");
  res.redirect('/')
} catch (err) {
  await conn.rollback();
  next(err);
} finally {
  console.log('finally')
  conn.release();
}
});



// POST - create new blog with single upload file
// router.post('/blogs', upload.single('comment_image'), async function (req, res, next) {


   

  
//     const file = req.body.comment_image;
//     if (!file) {
//       const error = new Error("Please upload a file");
//       error.httpStatusCode = 400;
//       return next(error);
//     }

//     const comment = req.body.comment;
//     const image = req.body.comment_image;

//     const conn = await pool.getConnection()
//     // Begin transaction
//     await conn.beginTransaction();

//     try {
    
//       let results = await conn.query(
//         "INSERT INTO comments('comment') VALUES(?);",
//         [comment]
//       )

//       const blogId = results[0].insertId;
    

//       await conn.query(
//         "INSERT INTO images(blog_id, file_path) VALUES(?, ?);",
//         [blogId, image])

//       await conn.commit()
//       // console.log("success")
//       res.send("success!");
//       return res.redirect('/');
//     } catch (err) {
//       await conn.rollback();
//       next(err);
//     } finally {
//       console.log('finally')
//       conn.release();
//     }
// });


// router.put("/blogs/:id", function (req, res) {
  // Your code here
  router.put('/blogs/:id', upload.single('myImage'), async (req, res, next) => {

    const conn = await pool.getConnection()
    await conn.beginTransaction();
  
    try {
      const file = req.file;
  
      if (file) {
        await conn.query(
          "UPDATE images SET file_path=? WHERE id=?",
          [file.path, req.params.id])
      }
  
      await conn.query('UPDATE blogs SET title=?,content=?, pinned=?, blogs.like=?, create_by_id=? WHERE id=?', [req.body.title, req.body.content, req.body.pinned, req.body.like, null, req.params.id])
      conn.commit()
      res.json({ message: "Update Blog id " + req.params.id + " Complete" })
    } catch (error) {
      await conn.rollback();
      return next(error)
    } finally {
      console.log('finally')
      conn.release();
    }
  });
  // return;
// });

router.delete("/blogs/:id", function (req, res) {
  // Your code here
  return;
});

exports.router = router;
