export interface DiscriminatorObject {
  propertyName: string;
  mapping?: {
      [key: string]: string;
  };
}

export interface SchemaObject {
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  example?: any;
  examples?: any[];
  deprecated?: boolean;
  type?: 'integer' | 'number' | 'string' | 'boolean' | 'object' | 'null' | 'array';
  format?: 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password' | string;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  not?: SchemaObject;
  items?: SchemaObject;
  properties?: {
      [propertyName: string]: SchemaObject;
  };
  additionalProperties?: SchemaObject | boolean;
  description?: string;
  default?: any;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
}