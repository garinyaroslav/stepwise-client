import { AxiosResponse, HttpStatusCode } from "axios";
import axios from "../axios";
import { UserRole } from "@/types/auth/UserRole";
import {
  Credentials,
  Group,
  GroupCreate,
  StudentForCreate,
  UserForCreate,
} from "./reqTypes";
import { GroupResponse, UserCreateResponse } from "./resTypes";

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

export const createGroup = async (
  groupObj: GroupCreate,
): Promise<AxiosResponse<void>> => {
  try {
    const res = await axios.post("/group", groupObj);
    if (res.status !== HttpStatusCode.Created)
      throw new Error("User creation failed");

    return res;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Network error");
  }
};

export const createUser = async (
  userObj: UserForCreate,
): Promise<AxiosResponse<UserCreateResponse>> => {
  try {
    const createRes = await axios.post<UserCreateResponse>(
      "/auth/signup",
      userObj,
    );
    if (createRes.status !== HttpStatusCode.Created)
      throw new Error("User creation failed");

    return createRes;
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

    const createRes = await createUser({
      username: studentObj.username,
      email: studentObj.email,
      password: studentObj.password,
      role: UserRole.STUDENT,
    });

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
