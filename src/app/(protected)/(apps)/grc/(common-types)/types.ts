export type Finding = {
  auditId: string;
  controlId: number;
  controlName: string;
  controlObjId: string;
  controlObjective: string;
  findingId: string;
  lastUpdatedOnOverall: string; // ISO string
  meetingId: string;
  observationDetails: ObservationDetail[];
  status: string;
  updatedByOverall: string;
};

export type ObservationDetail = {
  observation: string;
  recommendation: string;
  owner: string;
  conformity: string;
  updatedBy: string;
  lastUpdatedOn?: string; // optional based on structure
};
