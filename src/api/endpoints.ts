import { HttpStatusCode } from "axios";
import axios from "../axios";
import { Credentials, Group } from "./types";

export const loginReq = async (credentials: Credentials) => {
  const response = await axios.post("/auth/signin", credentials);
  if (response.status !== HttpStatusCode.Ok) throw new Error("Login failed");
  return response.data;
};

export const getGroups = async (search?: string): Promise<Group[]> => {
  try {
    const response = await axios.get("/group", {
      params: { search },
    });
    if (response.status !== HttpStatusCode.Ok) {
      throw new Error(
        `Groups fetch failed: ${response.data.message || "Unknown error"}`,
      );
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Network error");
  }
};
