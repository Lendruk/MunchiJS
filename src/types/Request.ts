// import { UserModel } from "../../models/user";

export interface Request {
  user?: Pick<any, any>;
  body?: any;
  headers?: any;
  query?: any;
  params?: any;
}
