export type DefenseSchedule = {
    id: number;
    academicWorkId: number;
    startTime: string;
    endTime?: string;
    maxStudents?: number;
    comment?: string;
    registeredCount: number;
    full: boolean;
    active: boolean;
};

export type MyDefenseRegistration = {
    id: number;
    scheduleId: number;
    scheduleStartTime: string;
    projectId: number;
    registeredAt: string;
    orderNumber?: number;
};

export type RegistrationDetails = {
    registrationId: number;
    studentId: number;
    firstName?: string;
    lastName?: string;
    username: string;
    orderNumber?: number;
    registeredAt: string;
};
