const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('Routing tests', () => {

    let test_id;
    
    suite('POST /api/books => create book object', () => {
      
      test('1) test POST /api/books with title', (done) => {

        const newBook = { title: 'Test book' };
        
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send(newBook)
          .end((err, res) => {
            
            assert.equal(   res.status, 200);
            assert.isOk(    res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            test_id = res.body._id;
            done();
          });
      });
      
      test('2) test POST /api/books with no title given', (done) => {

          const newBook = {};

          chai.request(server)
            .keepOpen()
            .post('/api/books')
            .send(newBook)
            .end((err, res) => {

              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            });
      });      
    });

    suite('GET /api/books => array of books', () => {
      
      test('3) test GET /api/books', (done) => {

        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end((err, res) => {

            assert.equal(   res.status, 200);
            assert.isArray( res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });
      
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('4) test GET /api/books/[id] with id not in db', (done) => {
        
        chai.request(server)
          .keepOpen()
          .get('/api/books/6571fd6f817cecec9dc1f000')
          .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
      test('5) test GET /api/books/[id] with valid id in db', (done) => {

        chai.request(server)
          .keepOpen()
          .get(`/api/books/${test_id}`)
          .end((err, res) => {

            assert.equal(   res.status, 200);
            assert.isOk(    res.body);
            assert.property(res.body, 'comments');
            assert.equal(   res.body.comments.length, 0);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(   res.body._id, test_id);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment', () => {
      
      test('6) test POST /api/books/[id] with comment', (done) => {

        const newComment = { comment: 'Test comment' };
        
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${test_id}`)
          .send(newComment)
          .end((err, res) => {

            assert.equal(   res.status, 200);
            assert.isOk(    res.body);
            assert.property(res.body, 'commentcount');
            assert.equal(   res.body.commentcount, 1);
            assert.property(res.body, 'comments');
            assert.equal(   res.body.comments.length, 1);
            assert.equal(   res.body.comments[0], 'Test comment');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(   res.body._id, test_id);
            done();
          });
      });

      test('7) test POST /api/books/[id] without comment field', (done) => {

        const newComment = {};

        chai.request(server)
          .keepOpen()
          .post(`/api/books/${test_id}`)
          .send(newComment)
          .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          });
      });

      test('8) test POST /api/books/[id] with comment, id not in db', (done) => {

        const newComment = { comment: 'Test comment' };

        chai.request(server)
          .keepOpen()
          .post(`/api/books/6571fd6f817cecec9dc1f000`)
          .send(newComment)
          .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('9) test DELETE /api/books/[id] with valid id in db', (done) => {

        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${test_id}`)
          .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test('10) test DELETE /api/books/[id] with  id not in db', (done) => {

        chai.request(server)
          .keepOpen()
          .delete(`/api/books/6571fd6f817cecec9dc1f000`)
          .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
