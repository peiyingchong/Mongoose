const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Car = require('./models/car')
// a reference to model Car

//put targeted database at the end of the url and connection will be done to the database
const url= 'mongodb://localhost:27017/libDB';
//can just connect to multiple databases using multiple url

//mongoose will call mongodb automatically from require("mongoose")
mongoose.connect(url,function(err){
    if(err === null)
    console.log("Connected Successfully")
    //need to parse data into the car constructor
    let car = new Car({_id: new mongoose.Types.ObjectId(),maker: 'BMW',model: 'X7',year: 2020});
    car.save(function(err){
        if(err)
        console.log('Unable to save');
        else 
        console.log('Saved successfully');
    });

}); 
