import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Call = mongoose.model("Call", callSchema);
export default Call;
