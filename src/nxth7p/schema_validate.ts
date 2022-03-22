import {SchemaObject} from './OpenApi';

export type SchemaValidateFn = (datan: any, schema: SchemaObject) => void;

const type_validate: Record<string, SchemaValidateFn> = {
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

export default function schema_validate(data: any, schema: SchemaObject) {
  if (!schema.type) {
    throw new Error(`schema.type no defined`);
  }
  if (schema.required && !data) {
    throw new Error('data is required');
  }
  if (data) {
    type_validate[schema.type](data, schema);
  }
}
