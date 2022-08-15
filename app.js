//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const app = express();
const _ = require('lodash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-omar:test123@cluster0.loa3rl7.mongodb.net/todoDB',{useNewUrlParser:true})

//to make Schema
const itemSchema={
  name:String
}
//to make new Model
const Item=mongoose.model("Item",itemSchema)
//to add in model
const item1=new Item({
  name:"Programming"
})

const item2=new Item({
  name:"Madrid"
})

const item3=new Item({
  name:"GYM"
})
const defultItems=[item1,item2,item3];
//Item.insertMany(defultItems);

const listSchema={
  name:String,
  items: [itemSchema]
}
const List=mongoose.model("Lists",listSchema)



app.get("/", function(req, res) {
  Item.find({}, function (err, foundItem) {

if (foundItem.length===0) {
  Item.insertMany(defultItems,function (err) {
    if (err) {
      console.log(err);
    }else {
      console.log("Sucessful");
    }

  })
res.redirect("/");

}else {
  res.render("list", {listTitle: "Today", newListItems: foundItem});
}  });  });


app.post("/", function(req, res){

  const item = req.body.newItem;
const valBut= req.body.list;

  const item4=new Item({name:item})

if (valBut==="Today") {
  item4.save();
  res.redirect("/");
}else {
  List.findOne({name:valBut},function (err,foundList) {
    foundList.items.push(item4);
    foundList.save();
    res.redirect("/"+valBut);
  })
}


});


app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);



List.findOne({name:customListName},function (err,result) {
  if (!err) {
if (!result) {
  //Create new List
  const list=new List({
    name:customListName,
    items:defultItems
  })
  list.save();
res.redirect("/"+customListName);
}else {
  //Show mogod
  res.render("list", {listTitle: result.name, newListItems: result.items});
}
  }

})

})




app.post("/delete",function (req,res) {
const checkedItemId= req.body.checkbox;
const listName=req.body.listName;

if (listName==="Today") {
  Item.findByIdAndRemove(checkedItemId, function (err) {
  if (!err) {
    console.log("Successfully");
    res.redirect("/")
  }

  })

} else {
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function (err,fo){
    if (!err) {
      res.redirect("/"+listName)
  }
})
}

});





app.get("/about", function(req, res){
  res.render("about");  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
