import { createRouter, useBase } from 'h3';
import pubsub from '~~/server/controllers/pubsub';

const router = createRouter();

router.get('/subscribe', pubsub.subcribe);
router.post('/publish', pubsub.publish);

export default useBase('/api', router.handler);
