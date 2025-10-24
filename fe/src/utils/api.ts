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
    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
  }
}

export async function getAllTests() {
  try {
    const response = await api.get("/api/testsets/all");
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách bài test."
    );
  }
}
export async function getTestById(id: string) {
  const response = await api.get(`/api/testsets/${id}`);
  return response;
}

export async function startAttempt(
  userId: string,
  testSetId: string,
  allowDuplicateOngoing?: boolean
) {
  try {
    const res = await api.post("/api/attempts/start", {
      userId,
      testSetId,
      allowDuplicateOngoing: !!allowDuplicateOngoing,
    });
    return res;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      "Không thể bắt đầu attempt. Thử lại nhé!";
    throw new Error(msg);
  }
}

export async function submitAttempt(attemptId: string) {
  try {
    const res = await api.post(`/api/attempts/${attemptId}/submit`);
    return res;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message || "Không thể nộp bài. Thử lại nhé!";
    throw new Error(msg);
  }
}

export async function upsertAnswer(
  attemptId: string,
  payload: {
    questionId: string;
    choiceId?: string | null;
    userAnswer?: string | null;
    part?: "listening" | "reading";
  }
) {
  try {
    const res = await api.post(`/api/attempts/${attemptId}/answers`, payload);
    return res;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      "Không thể lưu câu trả lời. Thử lại nhé!";
    throw new Error(msg);
  }
}
export async function getAttemptById(attemptId: string, withAnswers = false) {
  try {
    const res = await api.get(`/api/attempts/${attemptId}`, {
      params: { withAnswers },
    });
    return res;
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Không thể tải attempt.";
    throw new Error(msg);
  }
}

export async function listAttemptsByUser(userId: string, testSetId?: string) {
  try {
    const res = await api.get(`/api/attempts/user/${userId}`, {
      params: { testSetId },
    });
    return res;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      "Không thể tải danh sách bài làm của bạn.";
    throw new Error(msg);
  }
}
