import jwt from 'jsonwebtoken'
export const isAuthonticated = async(req,res,next)=>{
    try {
        const token = req.cookies.token 
        if (!token) {
            return res.status(400).json({
                success:false,
                message:"please login first!"
            })
        }
        const decode = jwt.verify(token,process.env.SECRET)
        req.user = decode.userId
        next()
    } catch (error) {
        console.log(error);
    }
}