const mongoose = require('mongoose');

let parcelSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto=true},
    sender: { type: String,
            validate: {
                validator : function(aSender){
                    return aSender.length >=3 
                },
                message: 'Sender should be more than 3 characters'}},
    weight: Number,
    fragile: String

})