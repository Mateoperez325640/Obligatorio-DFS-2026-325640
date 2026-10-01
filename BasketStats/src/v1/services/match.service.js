import Partido from "../models/match.model.js";
import Equipo from "../models/team.model.js";
import Categoria from "../models/category.model.js";
import User from "../models/user.model.js";

export const crearPartido = async (partidoData, userId) => {
  const { localTeam, visitorTeam, category, localScore, visitorScore, date } =
    partidoData;

  if (localTeam === visitorTeam) {
    const error = new Error(
      "El equipo local y el equipo visitante deben ser diferentes",
    );
    error.statusCode = 400;
    throw error;
  }

  const equipoLocal = await Equipo.findById(localTeam);

  if (!equipoLocal) {
    const error = new Error("Equipo local no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const equipoVisitante = await Equipo.findById(visitorTeam);

  if (!equipoVisitante) {
    const error = new Error("Equipo visitante no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const categoria = await Categoria.findById(category);

  if (!categoria) {
    const error = new Error("Categoría no encontrada");
    error.statusCode = 404;
    throw error;
  }

  const usuario = await User.findById(userId);

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (usuario.plan === "plus") {
    const cantidadPartidos = await Partido.countDocuments({
      user: userId,
    });

    if (cantidadPartidos >= 4) {
      const error = new Error(
        "Los usuarios con plan plus pueden crear hasta 4 partidos. Actualice su plan a premium para crear más partidos.",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  const partido = await Partido.create({
    localTeam,
    visitorTeam,
    category,
    localScore,
    visitorScore,
    date,
    user: userId,
  });

  return partido;
};

export const obtenerPartidosPaginados = async (
  userId,
  { pagina, limite, localTeam, visitorTeam, category },
) => {
  const filtro = { user: userId };

  if (localTeam !== undefined) {
    filtro.localTeam = localTeam;
  }

  if (visitorTeam !== undefined) {
    filtro.visitorTeam = visitorTeam;
  }

  if (category !== undefined) {
    filtro.category = category;
  }

  const [partidos, total] = await Promise.all([
    Partido.find(filtro)
      .sort({ _id: -1 })
      .skip((pagina - 1) * limite)
      .limit(limite),
    Partido.countDocuments(filtro),
  ]);

  return {
    partidos,
    pagina,
    limite,
    total,
    totalPaginas: Math.ceil(total / limite),
  };
};

export const obtenerPartidoPorId = async (partidoId, userId) => {
  const partido = await Partido.findOne({
    _id: partidoId,
    user: userId,
  });

  if (!partido) {
    const error = new Error("Partido no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return partido;
};

export const modificarPartido = async (partidoId, userId, data) => {
  const partido = await Partido.findOne({
    _id: partidoId,
    user: userId,
  });

  if (!partido) {
    const error = new Error("Partido no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const localTeam = data.localTeam ?? partido.localTeam.toString();
  const visitorTeam = data.visitorTeam ?? partido.visitorTeam.toString();

  if (localTeam === visitorTeam) {
    const error = new Error(
      "El equipo local y visitante no pueden ser iguales",
    );
    error.statusCode = 400;
    throw error;
  }

  if (data.localTeam !== undefined) {
    const existeLocal = await Equipo.findById(data.localTeam);

    if (!existeLocal) {
      const error = new Error("Equipo local no encontrado");
      error.statusCode = 404;
      throw error;
    }
  }

  if (data.visitorTeam !== undefined) {
    const existeVisitante = await Equipo.findById(data.visitorTeam);

    if (!existeVisitante) {
      const error = new Error("Equipo visitante no encontrado");
      error.statusCode = 404;
      throw error;
    }
  }

  if (data.category !== undefined) {
    const existeCategoria = await Categoria.findById(data.category);

    if (!existeCategoria) {
      const error = new Error("Categoría no encontrada");
      error.statusCode = 404;
      throw error;
    }
  }

  const partidoModificado = await Partido.findOneAndUpdate(
    {
      _id: partidoId,
      user: userId,
    },
    data,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return partidoModificado;
};

export const eliminarPartido = async (partidoId, userId) => {
  const partido = await Partido.findById(partidoId);

  if (!partido) {
    const error = new Error("Partido no encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (partido.user.toString() !== userId.toString()) {
    const error = new Error(
      "No puede eliminar el partido porque no le pertenece",
    );
    error.statusCode = 403;
    throw error;
  }

  const partidoEliminado = await Partido.findByIdAndDelete(partidoId);

  return partidoEliminado;
};

export const obtenerPartidoParaResumen = async (partidoId, userId) => {
  const partido = await Partido.findOne({
    _id: partidoId,
    user: userId,
  })
    .populate("localTeam", "name")
    .populate("visitorTeam", "name")
    .populate("category", "name");

  if (!partido) {
    const error = new Error("Partido no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return partido;
};
