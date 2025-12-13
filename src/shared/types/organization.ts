export interface IOrganization {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface ICreateOrganizationRequest {
  name: string;
  description: string;
}

export interface IUpdateOrganizationRequest {
  name?: string;
  description?: string;
}
