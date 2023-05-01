const express = require("express");
const pool = require("../config");

const router = express.Router();

// Get comment
router.get('/:blogId/comments', function(req, res, next){
     console.log(req.params.comments)
});

// Create new comment
router.post('/:blogId/comments', async function(req, res, next){
    // const [date, fields1] = await pool.query(
    //     'SELECT CURRENT_TIME()'
    // )
    // console.log(date)
     const {comment, like} = req.body;
     const [rows, fields] = await pool.query(
        'INSERT INTO comments(blog_id, comment, comments.like, comment_by_id) VALUES(?, ?, ?, ?)',
        [req.params.blogId, comment, like, null]
     )
     console.log(rows)

     
     return res.send({"message" : `A new comment is added ( ID : ${rows.insertId})`})
});

// Update comment
router.put('/comments/:commentId', async function(req, res, next){
    const {comment, like, comment_date, blog_id} = req.body
    const [rows, fields] = await pool.query(
    'UPDATE comments SET comment = ?, comments.like = ?, comment_date = ?,  comment_by_id = ?, blog_id  = ?   WHERE id = ?', [
        comment, like, comment_date, null, blog_id, req.params.commentId]

    )
    // const [rows1, fields1] = await pool.query(
    //     'UPDATE comments SET comments.like = ? WHERE id = ?', [like, req.params.commentId]
    // )
    // const [rows2, fields2] = await pool.query(
    //     'UPDATE comments SET comment_date = ? WHERE id = ?', [comment_date, req.params.commentId]
    // )

    // const [rows3, fields3] = await pool.query(
    //     'UPDATE comments SET comment_by_id = ? WHERE id = ?', [null, req.params.commentId]
    // )
    
    // const [rows4, fields4] = await pool.query(
    // 'UPDATE comments SET blog_id = ? WHERE id = ?', [blog_id, req.params.commentId]
    // )
    const [row5, fields5] = await pool.query(
        'SELECT comment, comments.like, comment_date, comment_by_id, blog_id from comments WHERE id = ?', [req.params.commentId]
    )
        console.log(row5)
    // const data = {
    //      "comment" : row5[0].comment,
    //      "like": row5[0].like,
    //      "comment_date": row5[0].comment_date,
    //      "comment_by_id": null,
    //      "blog_id": row5[0].blog_id
    // }

    return res.json({"message" : `Comment ID ${req.params.commentId} is updated.`, comment : req.body })

});

// Delete comment
router.delete('/comments/:commentId', async function(req, res, next){
    const [rows, fields] = await pool.query('DELETE FROM comments WHERE id = ?', [req.params.commentId])
    // const id_delete = req.params.commentId
    // const [row2, field2] = await pool.query('SELECT id FROM comments WHERE id > ?', [id_delete])
    // const id_update = row2[0].id
    // const [row1, field1] = await pool.query('UPDATE comments SET id = ? WHERE id > ?', [id_update - 1, id_delete])
    return res.send({message : `Comment ID ${req.params.commentId} is deleted `})
});

// Delete comment
router.put('/comments/addlike/:commentId', async function(req, res, next){
    // const {comment, like, comment_date, blog_id} = req.body
    
    const [rows, fields] = await pool.query('SELECT * FROM comments WHERE id = ?', [req.params.commentId])
    let likeNum = rows[0].like
    console.log(likeNum)
    likeNum += 1

    const [rows1, fields1] = await pool.query('UPDATE comments SET comments.like = ? WHERE id = ? ', [likeNum, req.params.commentId])
    const [row2, fields2] = await pool.query('SELECT blog_id, id, comments.like FROM comments WHERE id  = ?', [req.params.commentId])
    const data = {
        "blogId" :  row2[0].blog_id,
        "commentId" : row2[0].id,
        "likeNum" : row2[0].like
    }
    console.log(row2)
    
    return res.send(data)
});


exports.router = router