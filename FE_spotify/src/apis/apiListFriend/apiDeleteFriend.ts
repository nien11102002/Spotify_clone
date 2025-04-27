import api from "./../apiUtil";

export const deleteFriend = (data: any) => async () => {
  try {
    const response = await api.delete(`/friend/delete-friends/${data}`, data);
    return response.data.content;
  } catch (error) {
    console.error("Error delete friend:", error);
    return undefined;
  }
};
