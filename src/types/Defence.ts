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
