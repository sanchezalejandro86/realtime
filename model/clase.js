var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var claseSchema = {
    clase_id: Number,
    messages: [{
        inputId: Number,
        author: String,
        text: String
    }]
};

var Clase = mongoose.model('clases', claseSchema);

Clase.crearClase = function(id){
    //db.collection.find({_id: "myId"}, {_id: 1}).limit(1)
    Clase.update({clase_id: id}, { clase_id: id }, { upsert: true }).exec();
};

Clase.addMessage = function addMessage(claseId, inputId, sender, content){
    var msg = {
        inputId: inputId,
        author: sender,
        text: content
    };
    Clase.update({ clase_id: claseId }, { $push: { messages:  msg } }).exec();
};

Clase.getClase = function(clase_id, f){
    Clase.find({clase_id: clase_id}, function(err, docs){ f(docs); });
};

module.exports = Clase;