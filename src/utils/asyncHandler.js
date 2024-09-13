const asycnHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}

// const asycnHandler = (requestHandler) => async(req,res,next) => {
//     try {
//         await requestHandler (req,res,next)    
//     } catch (error) {
//         res.status (err.code||500).json({
//             succes : false ,
//             message : err.message
//         })
//     }
// }

export { asycnHandler }

// advansed javascript function with try , catch statment 
// const advanseedjsfunction = (takeFuncasParameter) => async(req,res,next) => {
    // try catch statment 
// }

// with promises 
// const func_name = (takefuncadparameter) => {
//     return(req,res,next) => Promise.resolve(takefuncadparameter(req,res,next)).catch((error)=>next(error))
// }