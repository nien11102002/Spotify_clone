import api from "./apiUtil";

export const apiSendFollow = async (data: any) => {
  try {
    const response = await api.post("/follow/send-follow", data);
    return response.data.content;
  } catch (error) {}
};
