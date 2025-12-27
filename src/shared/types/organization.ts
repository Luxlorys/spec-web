// IOrganization is defined in user.ts and exported from there

export interface ICreateOrganizationRequest {
  name: string;
  description: string;
}

export interface IUpdateOrganizationRequest {
  name?: string;
  description?: string;
}
