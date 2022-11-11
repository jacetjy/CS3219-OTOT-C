let mongoose = require('mongoose');
// Import contact model
let Contact = require('../models/contact');
/*
 * GET /contact route to retrieve all the contacts.
 */
function getContacts(req, res) {
    //Query the DB and if no errors, send all the contacts
    let query = Contact.find({});
    query.exec((err, contacts) => {
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(contacts);
    });
}

/*
 * POST /contact to save a new contact.
 */
function postContact(req, res) {
    //Creates a new contact
    var newContact = new Contact(req.body);
    //Save it into the DB.
    newContact.save((err,contact) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Contact successfully added!", contact });
        }
    });
}

/*
 * GET /contact/:id route to retrieve a contact given its id.
 */
function getContact(req, res) {
    Contact.findById(req.params.id, (err, contact) => {
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(contact);
    });        
}

/*
 * DELETE /contact/:id to delete a contact given its id.
 */
function deleteContact(req, res) {
    Contact.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Contact successfully deleted!", result });
    });
}

/*
 * PUT /contact/:id to updatea a contact given its id
 */
function updateContact(req, res) {
    Contact.findById({_id: req.params.id}, (err, contact) => {
        if(err) res.send(err);
        Object.assign(contact, req.body).save((err, contact) => {
            if(err) res.send(err);
            res.json({ message: 'Contact updated!', contact });
        });    
    });
}

//export all the functions
module.exports = { getContacts, postContact, getContact, deleteContact, updateContact };