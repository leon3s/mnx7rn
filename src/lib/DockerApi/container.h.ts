declare type ContainerCreateArg = {
  /** The hostname to use for the container, as a valid RFC 1123 hostname. */
  Hostname?: string;
  /** The domain name to use for the container. */
  Domainname?: string;
  /** The user that commands are run as inside the container. */
  User?: string;
  /** Whether to attach to stdin. */
  AttachStdin?: boolean;
  /** Whether to attach to stdout. */
  AttachStdout?: boolean;
  /** Whether to attach to stderr. */
  AttachStderr?: boolean;
  /**
   ** An object mapping ports to an empty object in the form:
   ** {"<port>/<tcp|udp|sctp>": {}}
   */
  ExposedPort?: Record<string, object>;
  /** Attach standard streams to a TTY, including stdin if it is not closed. */
  Tty?: boolean;
  /** Open stdin. */
  OpenStdin?: boolean;
  /** Close stdin after one attached client disconnects. */
  StdinOnce?: boolean;
  /**
   ** A list of environment variables to set inside the container
   ** in the form ["VAR=value", ...].
   ** A variable without = is removed from the environment,
   ** rather than to have an empty value.
   */
  Env?: string[]
  /**
   ** Command to run specified as a string or an array of strings.
   */
  Cmd?: string[];
  /**
   ** The test to perform. Possible values are:
   ** [] inherit healthcheck from image or parent image
   ** ["NONE"] disable healthcheck
   ** ["CMD", args...] exec arguments directly
   ** ["CMD-SHELL", command] run command with system's default shell
   */
  Healthcheck?: string[];
  /* The time to wait between checks in nanoseconds. It should be 0 or at least 1000000 (1 ms). 0 means inherit. */
  Interval?: number;
  /** The time to wait before considering the check to have hung. It should be 0 or at least 1000000 (1 ms). 0 means inherit. */
  Timeout?: number;
  /** The number of consecutive failures needed to consider a container as unhealthy. 0 means inherit. */
  Retries?: number;
  /** Start period for the container to initialize
   ** before starting health-retries countdown in nanoseconds.
   ** It should be 0 or at least 1000000 (1 ms). 0 means inherit.
   */
  StartPeriod?: number;
  /** The name of the image to use when creating the container */
  Image: string;
  /** An object mapping mount point paths inside the container to empty objects. */
  Volumes?: string;
  /** The working directory for commands to run in. */
  WorkingDir?: string;
  /** The entry point for the container as a string or an array of strings.
   ** If the array consists of exactly one empty string ([""])
   ** then the entry point is reset to system default
   ** (i.e., the entry point used by docker when there is no ENTRYPOINT instruction in the Dockerfile).
   */
  Entrypoint?: string[];
  /** Disable networking for the container. */
  NetworkDisabled?: boolean;
  /** MAC address of the container. */
  MacAddress?: string;
  /** User-defined key/value metadata. */
  Labels?: Record<string, string>;
}
