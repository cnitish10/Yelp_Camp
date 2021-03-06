const express=require('express')
const router=express.Router({mergeParams:true})
const Campground=require('../models/campground')
const Comment=require('../models/comment')
const middleware=require('../middleware/index')

router.get('/new',middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
if(err)console.log(err)
else res.render('comments/new',{camp:campground})
    })
    
})
router.post('/',middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err)console.log(err)
        else {
            Comment.create(req.body.comment,(err,comment)=>{
                if(err)console.log(err)
                else {
                    comment.author.id=req.user._id
                    comment.author.username=req.user.username
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/'+campground._id)
                }
            })
        }
    })
})


router.get('/:comment_id/edit',(req,res)=>{
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err)res.redirect('back')
        else  res.render('comments/edit',{camp_id:req.params.id,comment:foundComment})
    })
   
})


router.put('/:comment_id',(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
        if(err)res.redirect('back')
        else{
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})



module.exports=router