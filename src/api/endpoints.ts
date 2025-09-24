import { HttpStatusCode } from "axios";
import axios from "../axios";
import { UserRole } from "@/types/auth/UserRole";
import { Credentials, Group, StudentForCreate } from "./reqTypes";
import { GroupResponse, StudentCreateResponse } from "./resTypes";

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
      throw new Error("Groups fetch failed");
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Network error");
  }
};

export const createStudent = async (
  studentObj: StudentForCreate,
): Promise<void> => {
  try {
    const groupRes = await axios.get<GroupResponse>(
      `/group/${studentObj.groupId}`,
    );

    if (groupRes.status !== HttpStatusCode.Ok) {
      throw new Error("Group fetch failed");
    }

    const studentIds = groupRes.data.students.map((s) => s.id);

    const createRes = await axios.post<StudentCreateResponse>("/auth/signup", {
      username: studentObj.username,
      email: studentObj.email,
      password: studentObj.password,
      role: UserRole.STUDENT,
    });

    if (createRes.status !== HttpStatusCode.Created) {
      throw new Error("Student creation failed");
    }

    studentIds.push(createRes.data.id);

    const res = await axios.put("/group", {
      id: groupRes.data.id,
      studentIds: studentIds,
    });

    if (res.status !== HttpStatusCode.Ok) {
      throw new Error("Updating group with new student failed");
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Network error");
  }
};
