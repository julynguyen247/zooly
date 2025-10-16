import api from "./api.customize";

export async function loginWithGoogle(idToken: string) {
  try {
    const response = await api.post("/api/auth/login-google", { idToken });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Đăng nhập Google thất bại."
    );
  }
}
export async function getUser() {
  try {
    const response = await api.get("/api/auth/user", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin người dùng."
    );
  }
}
