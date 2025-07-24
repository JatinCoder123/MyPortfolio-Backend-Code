import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Message from "../model/message.js";

export const sendMessage = catchAsyncErrors (async (req, res,next) => {
  
    const { senderName,  message,email } = req.body;
    if (!senderName  || !message ||!email) {
        return next(new ErrorHandler("Please fill full form ",400));
    }
    const data = await Message.create({ senderName, email, message });
    res.status(200).json({
      success: true,
      message: "Message Sent",
      data,
    });
  
});
export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
  const messages=await Message.find();
  res.status(200).json({
    success:true,
    messages
  })
})

export const deleteMessage=catchAsyncErrors(async(req,res,next)=>{
  const{id}=req.params;
  const message=await Message.findById(id);
  if(!message){
    return next(new ErrorHandler("Message Already Deleted",400));

  }
  await message.deleteOne();
  res.status(200).json({
    success:true,
    message:"Message Deleted",
  })
})
