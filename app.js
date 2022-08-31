const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use("/js",express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(express.json())
app.listen(8080);

app.use(express.static('images'));
app.use(express.static('css'));

//referencing our schema
const Parcel = require('./models/parcel');
const { mainModule } = require('process');

let url = 'mongodb://localhost:27017/parcelDb'

mongoose.connect(url,function(err){
    if(err){
        console.log('Error in Mongoose Connection');
        throw err;
    }
    console.log('Succesfully connected')
})

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.get('/addParcel',function(req,res){
    res.sendFile(path.join(__dirname,'views/addparcel.html'));
})
app.post('/parcelAdded', (req, res) => {
    let newParcel = req.body;
    newParcel = new Parcel({
        weight: newParcel.weight,
        address: newParcel.address,
        cost: newParcel.cost,
        sender: newParcel.sender,
        fragile: newParcel.fragile
    })
    newParcel.save(function(err){
        if(err)throw err;
        console.log("newParcel successfully added")
    })
    res.redirect('/listparcel')
});  

app.get('/listparcel', function(req,res)
{
    Parcel.find({},function(err,docs){
        res.render(__dirname + '/views/list.html', {parcelDb:docs});
    })
})

app.get('/deletebyId',function(req,res){
    res.sendFile(path.join(__dirname,"/views/deletebyId.html"));
})
app.get('/deletebySender',function(req,res){
    res.sendFile(path.join(__dirname,"/views/deletebySender.html"));
})

app.post('/deletedId',function(req,res){
    Parcel.deleteOne({'_id': req.body.id},function(err,doc){
        console.log(doc);
    })
    res.redirect('/listparcel')
})

app.post('/deletedSender',function(req,res){
    Parcel.deleteMany({'sender': req.body.sender },function(err,doc){
        console.log(doc);
    })
    res.redirect('/listparcel')
})

app.get('/updateParcel',function(req,res){
    res.sendFile(path.join(__dirname,'views/updateparcel.html'));
});

app.post('/updated',function(req,res){
    Parcel.updateOne({"_id":req.body.id}, {$set: {'sender':req.body.sender,'weight':req.body.weight,"fragile":req.body.fragile,
    "cost":req.body.cost,"address":req.body.address}},function(err,doc){
        console.log(doc);
        res.redirect('/listparcel');
    })
})

app.get('/listparcelbySender', function(req,res)
{
    res.sendFile(path.join(__dirname,'views/listSenders.html'))
})
app.post('/senders',function(req,res){
    Parcel.find({"sender":req.body.sender},function(err,docs){
        if(err) res.json(err);
        else res.render(__dirname + '/views/list.html', {parcelDb:docs});
    })
})

app.get('/listparcelbyWeightRange', function(req,res)
{
    res.sendFile(path.join(__dirname,'views/listWeight.html'))
})

app.post('/weightRange',function(req,res){
    Parcel.find({"weight" :{$gte:req.body.min, $lte: req.body.max}},function(err,docs){
        if(err) res.json(err);
        else res.render(__dirname + '/views/list.html', {parcelDb:docs});
    })
})