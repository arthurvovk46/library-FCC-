'use strict';
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.DB)
  .then(console.log("Connected to DB"));

const Book = mongoose.model("Books", new mongoose.Schema(
  { title      : { type: String, required: true },
   commentcount: { type: Number, default: 0 },
   comments    : [String]
}));

module.exports = (app) => {

  app.route('/api/books')
    .get(async (req, res) => {
      //finding procces
      try {
        
        const books = await Book.find();

        res.send(books);
      //catch error by finding books
      } catch (error) {

        console.error(error);
        throw error
      }
    })
    .post((req, res) => {
      //retrieve parameters
      const { title } = req.body;
      
      const addBook = async (title) => {
        //creating procces
        try {

          const book = new Book({ title: title});
          const result = await book.save();

          res.json(result);
        //catch error by creating book
        } catch (error) {

          console.error(error);
          throw error
        }
      }

      !title 
        ? res.send("missing required field title")
        : addBook(title);
    })
    .delete(async (req, res) => {
      //delete procces
      try {
        //attempt to delete
        const result = await Book.deleteMany();

        if (result.acknowledged) res.send("complete delete successful");
      //catch error by deleting
      } catch (error) {

        console.error(error);
        throw error
      }   
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      //retrieve parameters
      const { id } = req.params;
      //finding procces
      try {
        //attempt to find
        const book = await Book.findById(id)

        !book
          ? res.send("no book exists")
          : res.send(book);
      //catch error by finding book
      } catch (error) {

        console.error(error);
        res.send("no book exists")
        throw error
      }
    })
    .post((req, res) => {
      //retrieve parameters
      const { id } = req.params;
      const { comment } = req.body;

      const addComment = async (id, comment) => {
        //commenting procces
        try {

          const book = await Book.findById(id);
          //if id is not valid
          if (!book) {

            res.send("no book exists");
          //adding a new comment and set up counter
          } else {
            
            book.comments.push(comment);
            book.commentcount++;

            const result = await book.save();

            res.send(result);
          }//catch error by adding comment
        } catch (error) {
          
          console.error(error);
          throw error 
        } 
      }
      //if comment is missing
      !comment
        ? res.send("missing required field comment")
        : addComment(id, comment)
    })
    .delete(async (req, res) => {
      //retrieve parameters
      const { id } = req.params;
      //delete procces
      try {
        //attempt to delete
        const result = await Book.findOneAndDelete({ _id: id });

        !result
          ? res.send("no book exists")
          : res.send("delete successful")
      //catch error by deleting
      } catch (error) {
        
        console.error(error)
        throw error
      } 
    });

};
