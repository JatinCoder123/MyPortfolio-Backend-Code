import mongoose from "mongoose";

const certificateSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "Title Require"],
  },
  description: {
    type: String,
    required: [true, "Description Required"],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});
const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
