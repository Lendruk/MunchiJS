export type PropertyOptions = {
  required?: boolean;
  default?: any;
  ref?: string;
  min?: number;
  max?: number;
  unique?: boolean;
  items?: Function;
  enum?: Array<string>;
  //Quick fix move this
  type?: Function;
};
