/** Payload enviado al DTO FraudForm del backend (camelCase). */
export interface FraudReportPayload {
  impostorDetails: string;
  contactInfo: string;
  comments: string;
}

export interface FraudReport {
  id: number;
  impostorDetails: string;
  contactInfo: string;
  comments: string;
  createdAt: string;
}

export interface FraudFormFields {
  impostorDetails: string;
  contactInfo: string;
  comments: string;
}

export type FraudFormErrors = Partial<Record<keyof FraudFormFields, string>>;
