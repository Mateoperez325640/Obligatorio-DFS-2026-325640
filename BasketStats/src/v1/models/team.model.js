import mongoose from "mongoose";

const equipoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

equipoSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Equipo = mongoose.model("Team", equipoSchema);

export default Equipo;
