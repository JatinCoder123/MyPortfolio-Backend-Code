import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Skill from "../model/skill.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Skill Icon/Svg  Required", 400));
  }
  const { icon } = req.files;
  const { title, proficiency } = req.body;
  if (!title || !proficiency) {
    return next(
      new ErrorHandler("Skill Title & Proficiency  are required", 400)
    );
  }
  const cloudinaryResponseForIcon = await cloudinary.uploader.upload(
    icon.tempFilePath,
    { folder: "SKILLS_ICONS" }
  );
  if (!cloudinaryResponseForIcon || cloudinaryResponseForIcon.error) {
    console.error(
      "Clodinary Error:",
      cloudinaryResponseForIcon.error || "Unknown Clodinary Error"
    );
  }
  const skill = await Skill.create({
    title,
    proficiency,
    icon: {
      public_id: cloudinaryResponseForIcon.public_id,
      url: cloudinaryResponseForIcon.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Skill Added",
    skill,
  });
});
export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Software Application not found", 400));
  }
  const iconImageId = skill.icon.public_id;
  await cloudinary.uploader.destroy(iconImageId);
  await skill.deleteOne();
  res.status(200).json({
    success: true,
    message: "Skill  Deleted",
  });
});
export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill not found", 400));
  }
  const newSkilldata = {
    title: req.body.title,
    proficiency: req.body.proficiency,
  };
  if (req.files && req.files.icon) {
    const icon = req.files.icon;
    const skill = await Skill.findById(id);
    const iconImageId = skill.icon.public_id;
    await cloudinary.uploader.destroy(iconImageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      icon.tempFilePath,
      { folder: "SKILLS_ICONS" }
    );
    newSkilldata.icon = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  const updatedSkill = await Skill.findByIdAndUpdate(id, newSkilldata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Skill Updated",
    updatedSkill,
  });
});
export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({
    success: true,
    skills,
  });
});
