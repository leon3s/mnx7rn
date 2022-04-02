/**
 *  HTTP CLIENT IMPLEMENTATION FOR DOCKER v1.37 system
 *  @see https://docs.docker.com/engine/api/v1.37/#tag/System
 */
import type { HttpClient } from "../HttpClient";

export default function generator(c: HttpClient) {
  return {
   /**
    *  This is a dummy endpoint you can use to test if the server is accessible.
    *  @see https://docs.docker.com/engine/api/v1.37/#operation/SystemPing
    */
    ping: () => {
      return c.get<string>('/ping');
    },

    /**
     *  Returns the version of Docker that is running and various information
     *  about the system that Docker is running on.
     *  @see https://docs.docker.com/engine/api/v1.37/#operation/SystemVersion
     */
    version: () => {
      return c.get<DockerVersion>('/version');
    },

    /**
     *  Stream real-time events from the server.
     *  @see https://docs.docker.com/engine/api/v1.37/#operation/SystemEvents
     */
    events: (args?: SystemEventsArgs) => {
      return c.get('/events', {
        is_stream: true,
        sp: args,
      });
    },
  }
}
