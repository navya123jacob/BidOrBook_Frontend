declare module 'socket.io-client' {
    import { ManagerOptions, SocketOptions } from "socket.io-client/build/esm";
    export { ManagerOptions, SocketOptions };
    import { Socket } from "socket.io-client/build/esm";
    export function io(
      uri: string,
      opts?: Partial<ManagerOptions & SocketOptions>
    ): Socket;
    export function io(opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  }
  