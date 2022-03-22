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

type ValidateFn = (datan: any, schema: SchemaObject) => void;

const type_validate: Record<string, ValidateFn> = {
  'string': (data) => {
    if (typeof data !== 'string') {
      throw new Error('not a string');
    }
  },
  'integer': (data) => {
    if (typeof data !== 'number') {
      throw new Error('not a number');
    }
  },
  'number': (data, schema) => {
    type_validate.integer(data, schema);
  },
  'boolean': (data) => {
    if (typeof data !== 'boolean') {
      throw new Error('not a boolean');
    }
  },
  'object': (data, schema) => {
    if (typeof data !== 'object') {
      throw new Error('not a object')
    }
    const properties = schema?.properties || {};
    const p_keys = Object.keys(properties);
    p_keys.forEach((key) => {
      try {
        schema_validate(data[key], properties[key]);
      } catch (e: any) {
        throw new Error(`${key} ${e.message}`);
      }
    });
  },
  'array': (data, schema) => {
    if (!data?.forEach) {
      throw new Error('not a array');
    }
    data.forEach((item: any) => {
      if (!schema.items) return;
      schema_validate(item, schema.items);
    });
  },
}

export function schema_validate(data: any, schema: SchemaObject) {
  if (!schema.type) {
    throw new Error(`schema.type no defined`);
  }
  return type_validate[schema.type](data, schema);
}
