import { UserService } from './user';

import type { Service } from './interface';
export type { Service } from './interface';

const services: Record<string, typeof Service> = {
  UserService,
};

export default services;
