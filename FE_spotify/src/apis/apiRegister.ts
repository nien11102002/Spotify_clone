import api from "./apiUtil";

export const apiRegister = async (account: any) => {
  try {
    const response = await api.post("/auth/register", account);
    return response.data.content;
  } catch (error: any) {
    throw new Error(error);
  }
};
