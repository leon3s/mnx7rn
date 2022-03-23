export type CommandFn = (...args: any[]) => Promise<any>;
export type Commands = Record<string, CommandFn>;

export type ArgSchema = {
  name: string;
  flags: string[];
  values?: string[];
  is_required?: boolean;
}

export type ArgsValues = {
  [props: string]: any;
}

export default async function args_parser(args: string[], args_schema: ArgSchema[]) {
  let schema_count = -1;
  let schema: ArgSchema | null = null;
  let args_new: string[] = [...args];
  const args_values: ArgsValues = {};
  while (schema = args_schema[++schema_count]) {
    let arg_count = -1;
    let arg: string | null = null;
    let is_matching = false;
    while (arg = args[++arg_count]) {
      is_matching = schema.flags.includes(arg);
      if (!is_matching) continue;
      args_values[schema.name] = true;
      if (schema?.values) {
        args_values[schema.name] = args_new.splice(arg_count + 1, schema.values.length);
        if (args_values[schema.name].length !== schema.values.length) {
          throw new Error(`flag needs an argument: ${schema.name}`);
        }
      }
      args_new = args_new.splice(1);
    }
    if (!is_matching && schema.is_required) {
      throw new Error(`${schema.name} is required but not found.`);
    }
  }
  return {args_values, args_new};
}
