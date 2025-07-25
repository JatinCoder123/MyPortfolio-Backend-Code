import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Project from "../model/project.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Project Banner Required", 400));
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !gitRepoLink ||
    // !projectLink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new ErrorHandler("Please Provide All Detailes", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: "PROJECT_BANNERS" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Clodinary Error:",
      cloudinaryResponse.error || "Unknown Clodinary Error"
    );
    return next(
      new ErrorHandler("Failed to upload project banner to cloudinary.", 500)
    );
  }
  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Skill Added",
    project,
  });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 400));
  }
  const projectBannerId = project.projectBanner.public_id;
  await cloudinary.uploader.destroy(projectBannerId);
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted",
  });
});
export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 400));
  }
  const newProjectdata = {
    title: req.body.title,
    description: req.body.description,
    gitRepoLink: req.body.gitRepoLink,
    projectLink: req.body.projectLink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };
  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner;
    const project = await Skill.findById(id);
    const projectBannerId = project.projectBanner.public_id;
    await cloudinary.uploader.destroy(projectBannerId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PROJECT_BANNERS" }
    );
    newProjectdata.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  const updatedProject = await Project.findByIdAndUpdate(id, newProjectdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Project Updated",
    updatedProject,
  });
});
export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.find();
  res.status(200).json({
    success: true,
    project,
  });
});
export const getProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 400));
  }
  res.status(200).json({
    success: true,
    project,
  });
});
