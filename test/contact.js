let mongoose = require('mongoose');

let Contact = require('../models/contact.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Contacts', () => {
    beforeEach((done) => { //Before each test we empty the database
        Contact.deleteMany({}, (err) => { 
           done();           
        });        
    });
  /*
  * Test the /GET route
  */
  describe('/GET contact', () => {
    it('it should GET all the contacts', (done) => {
      chai.request(server)
          .get('/contacts/')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
            done();
          });
    });
  });

  /*
  * Test the /POST route
  */
  describe('/POST contact', () => {
    it('it should not POST a contact without email', (done) => {
        let contact = {
            name: "Rebecca",
            phone: 32345678,
        }
      chai.request(server)
          .post('/contacts/')
          .send(contact)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email');
                res.body.errors.email.should.have.property('kind').eql('required');
            done();
          });
    });
    it('it should POST a contact ', (done) => {
      let contact = {
          name: "Mary",
          email: "mary@gmail.com",
          phone: 42345678,
          gender: "F"
      }
    chai.request(server)
        .post('/contacts/')
        .send(contact)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Contact successfully added!');
              res.body.contact.should.have.property('name');
              res.body.contact.should.have.property('email');
              res.body.contact.should.have.property('phone');
              res.body.contact.should.have.property('gender');
          done();
        });
    });
  });
  describe('/GET/:id contact', () => {
    it('it should GET a contact by the given id', (done) => {
        let contact = new Contact({ name: "Susanne", email: "susanne@gmail.com", phone: 42345678, gender: "F" });
        contact.save((err, contact) => {
            chai.request(server)
          .get('/contacts/' + contact.id)
          .send(contact)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.should.have.property('phone');
                res.body.should.have.property('gender');
                res.body.should.have.property('_id').eql(contact.id);
            done();
          });
        });

    });
  });
  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id contact', () => {
    it('it should UPDATE a contact given the id', (done) => {
        let contact = new Contact({name: "Susan", email: "gfg@gmail.com", phone: 12343231, gender: "F"})
        contact.save((err, contact) => {
              chai.request(server)
              .put('/contacts/' + contact.id)
              .send({name: "Susan", email: "abc@gmail.com", phone: 12343231, gender: "F"})
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact updated!');
                    res.body.contact.should.have.property('email').eql("abc@gmail.com");
                done();
              });
        });
    });
  });
});