declare type DockerVersion = {
  Version: string,
  Os: "linux" | "windows",
  KernelVersion: string;
  GoVersion: string;
  GitCommit: string;
  Arch: "amd64" | "i386";
  ApiVersion: string;
  MinAPIVersion: string;
  BuildTime: string;
  Experimental: boolean;
}

declare type SystemEventsArgs = {
  /** Show events created since this timestamp then stream new events. */
  since: string;
  /** Show events created until this timestamp then stop streaming. */
  until: string;
  /**
   ** A JSON encoded value of filters (a map[string][]string) to process on the event list.
   ** Available filters:
   ** config=<string> config name or ID
   ** container=<string> container name or ID
   ** daemon=<string> daemon name or ID
   ** event=<string> event type
   ** image=<string> image name or ID
   ** label=<string> image or container label
   ** network=<string> network name or ID
   ** node=<string> node ID
   ** plugin= plugin name or ID
   ** scope= local or swarm
   ** secret=<string> secret name or ID
   ** service=<string> service name or ID
   ** type=<string> object to filter by, one of container, image, volume, network, daemon, plugin, node, service, secret or config
   ** volume=<string> volume name
   */
  filters: string;
}
