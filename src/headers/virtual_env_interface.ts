/**
 * Virtual environement
 */
declare interface VirtualEnv {
  id: string;
  name: string;
  network_id: string;
}

/**
 * Virtual environement
 */
declare type VirtualEnvPartial = {
  name: string;
}
