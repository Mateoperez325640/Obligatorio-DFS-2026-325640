import api from "./authServices.js";

export const cambiarPlanApi = async () => {
  const token = localStorage.getItem("token");

  const respuesta = await api.patch(
    "/users/plan",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return respuesta.data;
};
