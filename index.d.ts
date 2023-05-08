import EventEmitter from 'events';
import Chat from 'node_characterai/chat';
import { Reply, Message } from 'node_characterai/message.js';

export interface ReplyStream extends EventEmitter {
  done: Promise<Reply>

  on(event: 'message', cb: (message: Reply) => void): this
  on(event: 'end', cb: (message: Reply) => void): this
  on(event: 'error', cb: (err: Error) => void): this

  once(event: 'message', cb: (message: Reply) => void): this
  once(event: 'end', cb: (message: Reply) => void): this
  once(event: 'error', cb: (err: Error) => void): this
}

export default class Client {
  login(access_token: string): Promise<this>
  stream(chat, options): Promise<ReplyStream>
  getChat(chat): Promise<Chat>
  resetChat(chat): Promise<Message>
}