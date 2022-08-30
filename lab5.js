let express = require('express');
let path = require('path');
let app = express();
app.use(express.json());
let db;

const mongodb = require("mongodb");
const { devNull } = require('os');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
//tells express to work on url encoded
app.use(express.urlencoded({extended: true}));

app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(express.json())
app.listen(8080);

app.use(express.static('images'));
app.use(express.static('css'));


MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
     if(err){
         console.log('Err',err);
     }
     else{
         console.log("Connected successfully to server");
         db = client.db("Week5Lab");
     }
 });

app.get('/',function(req,res){
     res.sendFile(path.join(__dirname,'views/index.html'));
});


app.get('/addParcel',function(req,res){
    res.sendFile(path.join(__dirname,"views/addparcel.html"));
})

app.post('/parceladded',function(req,res){
    let aParcel = req.body;
    db.collection('lib').insertOne(aParcel,()=>{res.redirect("/listparcel")});
});

app.get('/listparcel',function(req,res){
    db.collection('lib').find({}).toArray(function(err,data){
        console.log(data);
        res.render("list.html",{parcelDb:data})
    });
})

app.get('/deleteParcel',function(req,res){
    res.sendFile(path.join(__dirname,'views/deleteParcel.html'))
})

app.post('/deleted',function(req,res){
    let userDetails = req.body;
    let id = userDetails.id;

    if(id!==null && userDetails.sender ===null){
        db.collection("lib").deleteOne({_id:mongodb.ObjectId(id)},function(err,result){});
    }
    else if(userDetails.sender!==null && id ===null && userDetails.weight ===null && userDetails.add === null){
        let filter = {sender: userDetails.sender}
        db.collection("lib").deleteOne(filter);
    }
    else if(userDetails.sender !==null && id!== null && userDetails.weight ===null && userDetails.add === null){
        let filter = {sender: userDetails.sender}
        db.collection("lib").deleteMany({_id:mongodb.ObjectId(id)},function(err,result){});
        db.collection("lib").deleteOne(filter);
    }
    else if(userDetails.sender !==null && userDetails.weight !== null ){
        let filter = {"sender": userDetails.sender, weight: userDetails.weight}
        db.collection("lib").deleteOne(filter);
    }
    else if(userDetails.sender!== null && userDetails.add !== null){
        let filter = {"sender": userDetails.sender, "add": userDetails.add}
        db.collection("lib").deleteOne(filter,function(err,result){});
    }
    res.redirect("/listparcel");
});

app.get('/updateParcel',function(req,res){
    res.sendFile(path.join(__dirname,'views/updateparcel.html'));
});

app.post('/updated',function(req,res){
    let id = req.body.id;
    let sender = req.body.sender;
    let weight = req.body.weight;
    let fragile = req.body.fragile;
    let address = req.body.address;

    db.collection("lib").updateOne({_id:mongodb.ObjectId(id)},
     {$set: {"sender":sender,"weight":weight,"fragile":fragile, "add":address}},{upsert:true},function(err,reesult){});

    res.redirect("/listparcel");
})