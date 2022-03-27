import DaemonApi from "../lib/DaemonApi";

const daemon_api = new DaemonApi('./test.socket');

export default daemon_api;
