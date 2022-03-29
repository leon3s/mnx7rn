import { store } from '../Store';
import { UserService } from './User';

export type { Service } from './Interface';
export { UserService } from './User';

export const user_service = new UserService(store);
