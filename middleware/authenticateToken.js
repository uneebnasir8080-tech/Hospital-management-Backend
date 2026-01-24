


export const authenticateToken= (req,res,next)=>{

    const authHeader= req.headers['authorization']
    const token= authHeader && authHeader.split(" ")[1]   // Bearer token
    if(!token){
        return res.status(400).json({status:false, message:"Access token is required"})
    }
    next()
}