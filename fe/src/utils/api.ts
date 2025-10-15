import api from "./api.customize";

export async function loginWithGoogle(idToken: string) {
  try {
    const response = await api.post("/api/auth/login-google", { idToken });
    return response.data;
  } catch (error: any) {
    console.error("❌ loginWithGoogle error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Đăng nhập Google thất bại."
    );
  }
}
