import mongoose from "mongoose";

const timelineSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "Title Require"],
  },
  description: {
    type: String,
    required: [true, "Description Required"],
  },
  timeline: {
    from:{
      type:String,
      require:[true,"Timline Starting Date is required"]
    },
    to: String,
  },
});
const Timeline = mongoose.model("Timeline", timelineSchema);
export default Timeline;
