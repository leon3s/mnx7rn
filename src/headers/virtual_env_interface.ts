declare interface VirtualEnv {
  id: string;
  name: string;
  network_id: string;
}

declare type VirtualEnvPartial = {
  name: string;
}
