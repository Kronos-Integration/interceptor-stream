import {
  interceptorTest,
  testResponseHandler,
  MockReceiveInterceptor
} from 'kronos-test-interceptor';
import { MessageHandlerInterceptor } from '../src/message-handler-interceptor';
import { ConnectorMixin } from "@kronos-integration/interceptor";
import test from 'ava';

const logger = {
  debug(a) {
    console.log(a);
  }
};

function dummyEndpoint(name) {
  return {
    get name() {
      return name;
    },
    toString() {
      return this.name;
    },
    step: logger,
    owner: {
      name: 'owner name',
      type: 'owner type'
    }
  };
}

test(
  'basic',
  interceptorTest,
  MessageHandlerInterceptor,
  dummyEndpoint('ep1'),
  {},
  'message-handler',
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: 'message-handler'
    });

    if (!withConfig) return;

    interceptor.connected = dummyEndpoint('ep');
    interceptor.connected.receive = testResponseHandler;

    const response = await interceptor.receive({
      info: 'first message'
    });

    t.is(response.hops.length, 1);
    t.is(response.hops[0].host !== undefined, true);
    t.is(response.hops[0].id !== undefined, true);
    t.is(response.hops[0].time !== undefined, true);
    t.is(response.hops[0].stepName, 'owner name');
    t.is(response.hops[0].stepType, 'owner type');
    t.is(response.info, 'first message');
  }
);

test.skip(
  'multiple hops',
  interceptorTest,
  MessageHandlerInterceptor,
  dummyEndpoint('ep1'),
  {},
  'message-handler',
  async (t, interceptor, withConfig) => {
    t.deepEqual(interceptor.toJSON(), {
      type: 'message-handler'
    });

    if (!withConfig) return;

    const endpoint = dummyEndpoint('ep');

    const messageHandler1 = new MessageHandlerInterceptor(undefined, endpoint);
    const messageHandler2 = new MessageHandlerInterceptor(undefined, endpoint);
    const messageHandler3 = new MessageHandlerInterceptor(undefined, endpoint);

    messageHandler1.connected = messageHandler2;
    messageHandler2.connected = messageHandler3;
    messageHandler3.connected = testResponseHandler;

    interceptor.connected = messageHandler1;

    interceptor.connected.receive = testResponseHandler;

    const response = await interceptor.receive({
      info: 'first message'
    });
    console.log(response);

    t.is(response.hops.length, 1);
    t.is(response.hops[0].host !== undefined, true);
    t.is(response.hops[0].id !== undefined, true);
    t.is(response.hops[0].time !== undefined, true);
    t.is(response.hops[0].stepName, 'owner name');
    t.is(response.hops[0].stepType, 'owner type');
    t.is(response.info, 'first message');
  }
);

/*
      assert.deepEqual(request, {
        hops: [
          {
            endpoint: 'gumboIn',
            stepName: 'dummy step name',
            stepType: 'dummy step type'
          },
          {
            endpoint: 'gumboIn',
            stepName: 'dummy step name',
            stepType: 'dummy step type'
          },
          {
            endpoint: 'gumboIn',
            stepName: 'dummy step name',
            stepType: 'dummy step type'
          }
        ],
        info: 'first message',
        payload: {}
      });
*/
