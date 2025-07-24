import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Certificate from "../model/certificate.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewCertificate = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler(" Certificate  Required", 400));
  }
  const { image } = req.files;
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Provide all the details", 400));
  }

  const cloudinaryResponseForIcon = await cloudinary.uploader.upload(
    image.tempFilePath,
    { folder: "CERTIFICATES" }
  );
  if (!cloudinaryResponseForIcon || cloudinaryResponseForIcon.error) {
    console.error(
      "Clodinary Error:",
      cloudinaryResponseForIcon.error || "Unknown Clodinary Error"
    );
  }
  const certificate = await Certificate.create({
    title,
    description,
    image: {
      public_id: cloudinaryResponseForIcon.public_id,
      url: cloudinaryResponseForIcon.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Certificate Added",
    certificate,
  });
});
export const deleteCertificate = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);
  if (!certificate) {
    return next(new ErrorHandler("Certificate not found", 400));
  }
  const imageId = certificate.image.public_id;
  await cloudinary.uploader.destroy(imageId);
  await certificate.deleteOne();
  res.status(200).json({
    success: true,
    message: "Certificate Deleted",
  });
});
export const getAllCertificate = catchAsyncErrors(async (req, res, next) => {
  const certificates = await Certificate.find();
  res.status(200).json({
    success: true,
    certificates,
  });
});
