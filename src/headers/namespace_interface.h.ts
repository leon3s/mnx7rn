/**
 * Namespace interface used to wrap networks, vm and containers.
 */
declare interface Namespace {
  name: string;
}

declare interface NamespaceCreateArg {
  name: string;
}
