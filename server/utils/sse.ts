import { setHeaders, setResponseStatus } from 'h3';
import type { H3Event } from 'h3';

interface Client {
  id: string;
  evt: H3Event;
}

export class Manager {
  private clients: Client[];

  constructor() {
    this.clients = [];
  }

  addClient({ id, evt }: Client) {
    setHeaders(evt, {
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'content-type': 'text/event-stream'
    });
    setResponseStatus(evt, 200);

    this.clients.push({ id, evt });
  }

  removeClient(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
  }

  broadcast(client: Client, eventName: string, data: Record<string, any>) {
    client.evt.node.res.write(`id: ${client.id}\nevent: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  broadcasts(eventName: string, data: Record<string, any>) {
    this.clients.forEach((client) => this.broadcast(client, eventName, data));
  }
}
