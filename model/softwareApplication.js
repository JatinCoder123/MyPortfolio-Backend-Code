import mongoose from "mongoose";

const softwareApplicationSchema = mongoose.Schema({
  name: String,
  icon: {
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
const SoftwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicationSchema
);
export default SoftwareApplication;
