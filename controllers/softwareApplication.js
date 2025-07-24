import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import SoftwareApplication from "../model/softwareApplication.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Software Application Icon  Required", 400));
  }
  const { icon } = req.files;
  const { name } = req.body;
  if (!name) {
    return next(new ErrorHandler("Software's Name is required", 400));
  }
  const cloudinaryResponseForIcon = await cloudinary.uploader.upload(
    icon.tempFilePath,
    { folder: "PORTFOLIO_SOFTWARE_APPLICATIONS" }
  );
  if (!cloudinaryResponseForIcon || cloudinaryResponseForIcon.error) {
    console.error(
      "Clodinary Error:",
      cloudinaryResponseForIcon.error || "Unknown Clodinary Error"
    );
  }
  const softwareApplication = await SoftwareApplication.create({
    name,
    icon: {
      public_id: cloudinaryResponseForIcon.public_id,
      url: cloudinaryResponseForIcon.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Software Application Added",
    softwareApplication,
  });
});
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const softwareApplication = await SoftwareApplication.findById(id);
  if (!softwareApplication) {
    return next(new ErrorHandler("Software Application not found", 400));
  }
  const iconImageId = softwareApplication.icon.public_id;
  await cloudinary.uploader.destroy(iconImageId);
  await softwareApplication.deleteOne();
  res.status(200).json({
    success: true,
    message: "Software Application Deleted",
  });
});
export const getAllApplication = catchAsyncErrors(async (req, res, next) => {
  const softwareApplications = await SoftwareApplication.find();
  res.status(200).json({
    success: true,
    softwareApplications,
  });
});
