import { Role } from "../constants/role.constants.js";

const soloAdmin = (req, res, next) => {
  if (req.user.role !== Role.admin) {
    return res.status(403).json({
      message: "No tienes permisos para realizar esta acción",
    });
  }

  next();
};

export default soloAdmin;
