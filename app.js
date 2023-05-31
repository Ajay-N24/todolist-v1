const express=require("express");
const bodyParser=require("body-parser");
const app=express();
let _ = require('lodash');
const date=require(__dirname+"/date.js");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://Ajayprmk:0jsi9bTAi8wdeYyJ@cluster0.pap6tc8.mongodb.net/todoListDB");
const itemsSchema={
    name: String
};
const listSchema={
    name: String,
    items: [itemsSchema]
}
const List =mongoose.model("list",listSchema);
const item=mongoose.model("item",itemsSchema);
const item1=new item({
    name: "Ajay Nadar"
})
const item2=new item({
    name: "Roshan Nadar"
})
const item3=new item({
    name: "Priyadarshini Nadar"
})
const defaultItems=[item1,item2,item3]
// item.deleteOne({_id: "64707a5ddeb00cc5e4c37b57"})
// item.insertMany(defaultItems)
// .then(function (){
//     console.log("successfully inserted!")
// })
// .catch(function (err){   
//     console.log(err)
// })
// item.find()
// .then(function (items) {
//     mongoose.connection.close();
//     items.forEach(f => {
//       console.log(f.name)
//     });
//   })
//   .catch(function (err) {
//     console.log(err);
//   })


app.use(express.static("public"));
app.get("/",function(req,res){
    item.find({})
    .then(function (items) {
        if(items.length===0){
            item.insertMany(defaultItems)
            .then(function (){
                console.log("successfully inserted!")
            })
            .catch(function (err){   
                console.log(err)
            })
        }
        items.forEach(f => {
        console.log(f.name) 
        });
        // const arr = Array.from(items);
        res.render("list",{listTitle:"Today",newListItems: items});
    })
    .catch(function (err) {
        console.log(err);
    })
})
app.post("/delete",function(req,res){
    const id=req.body.checkbox1;
    const listName=req.body.listName;
    if(listName==="Today"){
       item.findByIdAndRemove(id)
    .then(()=>{
        console.log(`Deleted ${id} Successfully`);
        res.redirect("/");
    })
    .catch((err) => 
        console.log("Deletion Error: " + err)
        ); 
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: id}}})
        .then(()=>{
            res.redirect("/"+listName)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
})
// let name = [];

// const names = async function() {
//     const i = await item.find();
//     name = i.map(r => r.name);
//     console.log(name);
// }

// names();
// setTimeout(() => console.log(name),1000);
// // item
// //     .find()
// //     .then(res =>  { 
// //         const arr = res.map( r => 
// //             {
// //                 console.log(r.name); 
// //                 return r.name;
// //             })
// //         console.log(arr);
// //         return arr;
// //     });
app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const newItem1 = new item({
        name: itemName
    });
    if(listName=="Today"){
        newItem1.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName})
        .then((foundList)=>{
            foundList.items.push(newItem1);
            foundList.save();
            res.redirect("/"+listName);
        })
        .catch((err)=>{
            console.log(err)
        })
    }
})
// app.get("/work",function(req,res){
//     res.render("list",{listTitle: "Work List",newListItems: workItems});
// })
app.get("/:pt",function(req,res){
    const customListName= _.capitalize(req.params.pt);
    List.findOne({name: customListName})
    .then((foundList)=>{
        // Create a new List
        if(!foundList){
            const li=new List({
              name: customListName,
              items: defaultItems
          });
          li.save();  
          console.log("List Added Successfully!!")
          res.redirect("/"+customListName);
        }
        // show an existing list
        else{
            res.render("list",{listTitle: foundList.name,newListItems: foundList.items});
        }
    })
    .catch((err)=>{
        console.log(err)
    })  
})
app.get("/about",function(req,res){
    res.render("about");
})
app.listen(3000,function(){
    console.log("app running on port 3000!");
})