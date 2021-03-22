export type RouteOptions = {
  [index: string]: any;

  body?: { required: Array<string> };
  params?: { required: Array<string> };
  headers?: { required: Array<string> };
  uploadFiles?: boolean;

  requireToken?: boolean;
};
