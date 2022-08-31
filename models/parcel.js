const mongoose = require('mongoose');

let parcelSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto:true},
    weight: Number,
    fragile: String,
    address: String,
    cost: Number,
    sender: { type: String,
            validate: {
                validator : function(aSender){
                    return aSender.length >=3 
                },
                message: 'Sender should be more than 3 characters'}}
})
module.exports = mongoose.model('Parcel',parcelSchema)