import { store } from '../Store';
import { UserService } from './User';
import { VirtualEnvService } from './VirtualEnv';

export type { Service } from './Interface';

export { UserService } from './User';
export {VirtualEnvService} from './VirtualEnv';

export const user_service = new UserService(store);
export const virtual_env_service = new VirtualEnvService(store);
