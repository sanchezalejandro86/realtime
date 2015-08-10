var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var claseSchema = {
    clase_id: String,
    date: Number, //--Timestamp
    messages: [{
        inputId: Number,
        author: String,
        text: String,
        teacher: Boolean
    }]
};

var Clase = mongoose.model('clases', claseSchema);

Clase.createClass = function (id){
    Clase.update({clase_id: id}, { $setOnInsert: { clase_id: id, date: new Date().getTime() } }, { upsert: true }).exec();
};

Clase.addMessage = function (claseId, inputId, author, text, teacher){
    var msg = {
        inputId: inputId,
        author: author,
        text: text,
        teacher: teacher
    };
    Clase.update({ clase_id: claseId }, { $push: { messages:  msg } }).exec();
};

Clase.getClase = function (clase_id, f){
    Clase.find({clase_id: clase_id}, function(err, docs){ f(docs); });
};

Clase.removeMessage = function (claseId, inputId){
    Clase.update({ clase_id: claseId }, { $pull: { messages:  {inputId : inputId} } }).exec();
};

Clase.updateMessage = function (claseId, inputId, text){
    Clase.update({ clase_id: claseId, "messages.inputId" : inputId}, { $set: { "messages.$.text" : text } }).exec();
};

Clase.getClases = function (f) {
    Clase.find(
        { },
        { _id: 0, clase_id: 1, date: 1 }
    ).exec(f);
};

module.exports = Clase;