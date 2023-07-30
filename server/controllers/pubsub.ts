import { readBody } from 'h3';
import { randomUUID } from 'node:crypto';
import type { H3Event } from 'h3';

import { Manager } from '~~/server/utils/sse';

const sse = new Manager();

// source: https://gist.github.com/Atinux/05836469acca9649fa2b9e865df898a2
const subcribe = (evt: H3Event) => {
  const client = { id: randomUUID(), evt };
  sse.addClient(client);

  sse.broadcast(client, 'connect', { message: 'Connection Established' });

  evt.node.req.on('close', () => sse.removeClient(client.id));

  // Let the connection opened
  evt._handled = true;
};

const publish = async (evt: H3Event) => {
  const body = await readBody<Record<string, any>>(evt);

  sse.broadcasts('update', body);

  return body;
};

export default {
  subcribe: defineEventHandler(subcribe),
  publish: defineEventHandler(publish)
};
