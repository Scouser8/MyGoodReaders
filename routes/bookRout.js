const express = require('express');
const bookModel = require("../models/Book");
const router = express.Router();
const publicPath = require("../public/Path");
router.post("/", (req,res) =>
{
  let newBook=req.body;
  const book = new bookModel(newBook);
  
  book.save()
  .then( () =>
  {
   res.send(book);
  })
})

router.get("/books",(req,res)=>
{
    bookModel.find({},(err, books)=>{
    if(err) return res.send(err) ;
        res.set("content-type","application/json");
        res.send(books);
        
    })
})



//Added by Muhammad
router.get("/popularBooks",(req,res)=>
{
    bookModel.find()
    .populate('categoryId', 'name')
    .sort({ avgRating: -1 })
    .limit(8)
    .exec( (err,books) => {
        if(err) return res.send("Failed to get the popular books.");
        console.log(books);
        res.send(books);
    })
})

router.get("/",(req,res)=>
{    
   
    res.sendFile(publicPath+'/Allbooks.html') 
    
    
})

router.get("/singlebook",(req,res)=>
{       
        res.sendFile(publicPath+'/bookProfile.html') 
})


router.get("/settingTheRequiredBook/:id",(req,res)=>
{       
    console.log(req.params.id)
    req.session.requiredBook=req.params.id
    res.send('ok') 
})

router.get("/:id",(req,res)=>
{
    bookModel.findOne({_id:req.params.id},(err, Book)=>{
    if(err) return res.send(err) ;

         console.log(Book)
         res.set("content-type","application/json");
    	res.send(Book);
    })
})


router.get("/define/Book",(req,res)=>
{    
   
    
    //
    //"5c8d72bb0806621ec3a77c2d"
     bookModel.findOne({_id:req.session.requiredBook})
    .populate("authorId",{ "first_name" : 1,"last_name" : 1, _id :0 })
    .populate("categoryId","name")
    .exec ((err, Book)=>{
     if(err) return res.send(err) ;
       res.set("content-type","application/json");
       res.send(Book);
    })
})


//route add by rahma to get all books of a certain author ;
router.get("/author/info",(req,res)=>{
   bookModel.find({authorId:req.session.authorId},(err,authorBooks)=>{
    if(err) return res.send(err) ;
    
    res.set("content-type","application/json");
    res.send(authorBooks);
    //    res.send(res);
   })
})

router.delete("/:id",(req,res)=>
{
   let idToDelete = req.params.id;
   
   bookModel.deleteOne({_id:idToDelete})
    .then( ()=>
    {
        res.send("Book delete"); 
    })
})

router.put("/:id",(req,res)=>
{
    
    let idToUpdate = req.params.id;
   let updatedBOOK = req.body;
   bookModel.updateOne({_id:idToUpdate},updatedBOOK)
    .then(() =>
    { 
        res.send("book updated "); 
    })
})

module.exports = router;