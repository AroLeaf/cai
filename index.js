import CharacterAI from 'node_characterai';
import { OutgoingMessage, Reply, Message } from 'node_characterai/message.js';
import EventEmitter from 'events';

export default class Client {
  constructor() {
    this.cai = new CharacterAI();
  }

  async login(access_token) {
    await this.cai.authenticateWithToken(access_token);
    return this;
  }

  async getChat(character) {
    return this.cai.createOrContinueChat(character);
  }

  async resetChat(chat) {
    const res = await chat.saveAndStartNewChat();
    chat.changeToConversationId(res.external_id, true);
    return new Message(chat, res.messages[0]);
  }

  async stream(chat, options) {
    const payload = new OutgoingMessage(chat, options);
    
    const res = await fetch('https://beta.character.ai/chat/streaming/', {
      method: 'POST',
      headers: this.cai.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (res.status === 200) {
      const emitter = new EventEmitter();

      emitter.done = new Promise(async (resolve, reject) => {
        let last;
        for await (const chunk of res.body) {
          try {
            const text = Buffer.from(chunk).toString('utf8').trim();
            if (!text) continue;
            const json = JSON.parse(text);
            const reply = new Reply(chat, json);
            emitter.emit('message', reply);
            last = reply;
          } catch(error) {
            emitter.emit('error', error);
            return reject(error);
          }
        }

        if (last.isFinalChunk) {
          emitter.emit('end', last);
          return resolve(last);
        } else {
          const error = new Error('Stream ended unexpectedly');
          emitter.emit('error', error);
          return reject(error);
        }
      });

      return emitter;
    } else throw Object.assign(new Error('Could not stream message'), { status: res.status, statusText: res.statusText, body: await res.text() });
  }
}