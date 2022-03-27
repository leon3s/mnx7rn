import { UserService } from './User';
export { UserService } from './User';

import type { Service } from './Interface';
export type { Service } from './Interface';

const services: Record<string, typeof Service> = {
  UserService,
};

export default services;
