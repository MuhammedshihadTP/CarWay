module.exports.author =  function(req,res,next){
    if(req.session.log){
        next()
    }else{
        res.redirect('/login')
    }
}