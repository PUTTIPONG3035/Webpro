const express = require("express");
const pool = require("../config");

router = express.Router();

router.get("/", async function (req, res, next) {
  // try {
  //   const [rows, fields] = await pool.query(
  //     `SELECT a.*, b.file_path FROM blogs AS a LEFT JOIN 
  //     (SELECT * FROM images WHERE main=1) AS b ON a.id = b.blog_id;`
  //   );
  //   return res.json(rows);
  // } catch (err) {
  //   return next(err)
  // }

  
  try{
    console.log(req.query.search)
  let query = `SELECT a.*, b.file_path FROM blogs AS a LEFT JOIN 
    (SELECT * FROM images WHERE main=1) AS b ON a.id = b.blog_id`
    let params = []
    if (req.query.search){
      query = query + ` WHERE a.title LIKE ?`
      params = [`%${req.query.search}%`]
    }
    const [rows, fields] = await pool.query(query, params);
    return res.json( { 
      search: req.query.search || '', 
      blogs: rows 
    });
  } catch (err) {
    return next(err)
  }
});

exports.router = router;
