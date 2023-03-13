import EventEmitter from 'events';
import { Reply } from 'node_characterai/message.js';

export interface ReplyStream extends EventEmitter {
  done: Promise<Reply>

  on(event: 'message', cb: (message: Reply) => void): ReplyStream
  on(event: 'end', cb: (message: Reply) => void): ReplyStream
  on(event: 'error', cb: (err: Error) => void): ReplyStream

  once(event: 'message', cb: (message: Reply) => void): ReplyStream
  once(event: 'end', cb: (message: Reply) => void): ReplyStream
  once(event: 'error', cb: (err: Error) => void): ReplyStream
}

export default class Client {
  login(access_token: string): Promise<this>
  stream(chat, options): Promise<ReplyStream>
}