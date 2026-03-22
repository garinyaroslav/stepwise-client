import { AxiosResponse, HttpStatusCode } from "axios";
import axios from "../axios";
import { UserRole } from "@/types/auth/UserRole";
import {
    CreateAcademicWork,
    Credentials,
    Group,
    GroupCreate,
    SaveWorkTemplate,
    StudentForCreate,
    UpdateProject,
    UserForCreate,
} from "./reqTypes";
import { GroupResponse, Pageiable, UserCreateResponse } from "./resTypes";
import { UserWithProfile } from "@/types/UserWithProfile";
import { ProfileDto } from "@/types/Profile";
import { WorkTemplate } from "@/types/WorkTemplate";
import { AcademicWork } from "@/types/AcademicWork";
import { ProjectDetails } from "@/types/ProjectDetails";

export const loginReq = async (credentials: Credentials) => {
    const response = await axios.post("/auth/sessions", credentials);
    if (response.status !== HttpStatusCode.Ok) throw new Error("Login failed");
    return response.data;
};

export const getGroups = async (search?: string): Promise<Group[]> => {
    try {
        const response = await axios.get<Group[]>("/group", {
            params: { search },
        });
        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Groups fetch failed");

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const getStudentsByGroupId = async (
    groupId: number,
): Promise<UserWithProfile[]> => {
    try {
        const response = await axios.get<UserWithProfile[]>(
            `/user/student/${groupId}`,
        );
        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Students fetch failed");

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const getStudents = async (
    search?: string,
): Promise<UserWithProfile[]> => {
    try {
        const response = await axios.get<Pageiable<UserWithProfile>>(
            "/user/student",
            {
                params: { search },
            },
        );
        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Students fetch failed");

        return response.data.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const getTeachers = async (
    search?: string,
): Promise<UserWithProfile[]> => {
    try {
        const response = await axios.get<Pageiable<UserWithProfile>>(
            "/user/teacher",
            {
                params: { search },
            },
        );
        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Teachers fetch failed");

        return response.data.data;
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

export const addStudentToGroup = async (studentId: number, groupId: number) => {
    try {
        const groupRes = await axios.get<GroupResponse>(`/group/${groupId}`);

        if (groupRes.status !== HttpStatusCode.Ok)
            throw new Error("Group fetch failed");

        const studentIds = groupRes.data.students.map((s) => s.id);

        studentIds.push(studentId);

        const res = await axios.put("/group", {
            id: groupRes.data.id,
            studentIds: studentIds,
        });

        if (res.status !== HttpStatusCode.Ok)
            throw new Error("Updating group with new student failed");
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const removeStudentFromGroup = async (
    studentId: number,
    groupId: number,
) => {
    try {
        const groupRes = await axios.get<GroupResponse>(`/group/${groupId}`);

        if (groupRes.status !== HttpStatusCode.Ok)
            throw new Error("Group fetch failed");

        const studentIds = groupRes.data.students.map((s) => s.id);

        const filteredStudentids = studentIds.filter((id) => id !== studentId);

        const res = await axios.put("/group", {
            id: groupRes.data.id,
            studentIds: filteredStudentids,
        });

        if (res.status !== HttpStatusCode.Ok)
            throw new Error("Updating group id failed");
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const createUser = async (
    userObj: UserForCreate,
): Promise<AxiosResponse<UserCreateResponse>> => {
    const createRes = await axios.post<UserCreateResponse>(
        "/auth/users",
        userObj,
    );

    return createRes;
};

export const createStudent = async (
    studentObj: StudentForCreate,
): Promise<AxiosResponse<UserCreateResponse>> => {
    try {
        const groupRes = await axios.get<GroupResponse>(
            `/group/${studentObj.groupId}`,
        );

        if (groupRes.status === HttpStatusCode.NotFound) {
            throw new Error("Группа не найдена.");
        }
        if (groupRes.status !== HttpStatusCode.Ok) {
            throw new Error("Не удалось получить данные группы.");
        }

        const studentIds = groupRes.data.students.map((s) => s.id);

        const createRes = await createUser({
            username: studentObj.username,
            email: studentObj.email,
            password: studentObj.password,
            role: UserRole.STUDENT,
        });


        studentIds.push(createRes.data.id);

        const updateRes = await axios.put("/group", {
            id: groupRes.data.id,
            studentIds: studentIds,
        });

        if (updateRes.status !== HttpStatusCode.Ok) {
            throw new Error("Обновление группы с новым студентом не удалось.");
        }

        return createRes;
    } catch (error: any) {
        if (error.response?.status === HttpStatusCode.Conflict) {
            throw new Error("Студент с таким именем пользователя или почтой уже существует.");
        }

        if (error.response?.status === HttpStatusCode.NotFound) {
            throw new Error("Группа не найдена.");
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Произошла ошибка при создании студента.");
    }
};
export const getAcademicWorksByGroupId = async (
    groupId?: number,
): Promise<AcademicWork[]> => {
    try {
        const response = await axios.get<AcademicWork[]>(
            `/work/group/${groupId}`,
        );
        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Academic projects fetch failed");

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const getAcademicWorkById = async (
    workId?: number,
): Promise<AcademicWork> => {
    try {
        const response = await axios.get<AcademicWork>(
            `/work/${workId}`,
        );
        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Academic project fetch failed");

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const getStudentAcademicWorks = async (): Promise<AcademicWork[]> => {
    try {
        const response = await axios.get<AcademicWork[]>("/work/student");

        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Academic project fetch failed");

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const createAcademicWork = async (
    project: CreateAcademicWork
): Promise<void> => {
    try {
        const res = await axios.post("/work", project);

        if (res.status !== HttpStatusCode.Created)
            throw new Error("Academic work is not created");
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
}

export const exportGroupCredentials = async (groupId: number) => {
    try {
        const res = await axios.get(`/user/student/${groupId}/export`, { responseType: "blob" });

        if (res.status !== HttpStatusCode.Ok)
            throw new Error("Error while export group credentials");

        return res;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
}

export const getMyProfile = async () => {
    try {
        const res = await axios.get<UserWithProfile>("/user/profile");

        if (res.status !== HttpStatusCode.Ok)
            throw new Error("Error while getting profile");

        return res.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
}


export const updateMyProfile = async (
    profileObj: ProfileDto
): Promise<AxiosResponse<UserWithProfile>> => await axios.put("/user/profile", profileObj);

export const passwordResetReq = async (email: string) =>
    await axios.post("/auth/password-reset-requests", null, {
        params: {
            email
        }
    });

export const resetPassword = async (token: string, newPassword: string) =>
    await axios.patch("/auth/passwords", { token, newPassword });

export const getMyTemplates = async (pageNumber: number, pageSize: number, search: string) => {
    try {
        const res = await axios.get<Pageiable<WorkTemplate>>("/template", { params: { pageNumber, pageSize: pageSize, search } });

        if (res.status !== HttpStatusCode.Ok)
            throw new Error("Error while getting templates");

        return res.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
}

export const getTemplate = async (id: number) => {
    try {
        const res = await axios.get<WorkTemplate>(`/template/${id}`);

        if (res.status !== HttpStatusCode.Ok)
            throw new Error("Error while getting template");

        return res.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
}

export const createTemplate = async (t: SaveWorkTemplate) =>
    await axios.post("/template", {
        workTitle: t.workTitle,
        workDescription: t.workDescription,
        templateTitle: t.title,
        templateDescription: t.description,
        type: t.type,
        teacherId: t.teacherId,
        chapters: t.chapters
    });

export const updateTemplate = async (t: SaveWorkTemplate) =>
    await axios.patch(`/template/${t.id}`, {
        workTitle: t.workTitle,
        workDescription: t.workDescription,
        templateTitle: t.title,
        templateDescription: t.description,
        type: t.type,
        chapters: t.chapters
    });

export const deleteTemplate = async (id: number) =>
    await axios.delete(`/template/${id}`);

export const getStudentProjectByWorkId = async (workId: number): Promise<ProjectDetails[]> => {
    try {
        const response = await axios.get<ProjectDetails[]>(`/project/work/${workId}`);

        if (response.status !== HttpStatusCode.Ok)
            throw new Error('Project fetch failed');

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error('Network error');
    }
};

export const getProjectById = async (projectId: number): Promise<ProjectDetails> => {
    try {
        const response = await axios.get<ProjectDetails>(`/project/${projectId}`);

        if (response.status !== HttpStatusCode.Ok)
            throw new Error("Project fetch failed");

        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
    }
};

export const updateProject = async (dto: UpdateProject): Promise<void> => {
    try {
        const response = await axios.put('/project', dto);

        if (response.status !== HttpStatusCode.Ok)
            throw new Error('Project update failed');
    } catch (error) {
        throw error instanceof Error ? error : new Error('Network error');
    }
};

export const draftExplanatoryNoteItem = async (projectId: number, file: File): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('projectId', String(projectId));
        formData.append('file', file);

        const response = await axios.post('/explanatory-note-item/draft', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status !== HttpStatusCode.Created)
            throw new Error('Draft creation failed');
    } catch (error) {
        throw error instanceof Error ? error : new Error('Network error');
    }
};

export const submitExplanatoryNoteItem = async (itemId: number): Promise<void> => {
    try {
        const response = await axios.post(`/explanatory-note-item/${itemId}/submition`);

        if (response.status !== HttpStatusCode.Ok)
            throw new Error('Submit failed');
    } catch (error) {
        throw error instanceof Error ? error : new Error('Network error');
    }
};

export const downloadExplanatoryNoteFile = async (
    projectId: number,
    itemId: number,
    historyId?: number,
): Promise<void> => {
    try {
        const response = await axios.get('/explanatory-note-item/file', {
            params: { projectId, itemId, ...(historyId != null ? { historyId } : {}) },
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'] as string | undefined;
        const match = disposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const fileName = match?.[1]?.replace(/['"]/g, '') ?? `file-${itemId}.pdf`;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error instanceof Error ? error : new Error('Download failed');
    }
};

export const getProjectsByWorkForTeacher = async (workId: number): Promise<ProjectDetails[]> => {
    const response = await axios.get<ProjectDetails[]>(`/project/work/${workId}/teacher`);
    return response.data;
};

export const approveProjectForDefense = async (projectId: number): Promise<void> => {
    await axios.post(`/project/${projectId}/approval`);
};

export const approveExplanatoryNoteItem = async (itemId: number, teacherComment: string): Promise<void> => {
    await axios.post(`/explanatory-note-item/${itemId}/approval`, { teacherComment });
};

export const rejectExplanatoryNoteItem = async (itemId: number, teacherComment: string): Promise<void> => {
    await axios.post(`/explanatory-note-item/${itemId}/rejection`, { teacherComment });
};
