import mongoose from "mongoose";

const jugadorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
});

jugadorSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Jugador = mongoose.model("Player", jugadorSchema);

export default Jugador;
