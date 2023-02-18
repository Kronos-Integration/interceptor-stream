import test from "ava";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { createReadStream } from "node:fs";
import {
  dummyEndpoint,
  interceptorTest
} from "@kronos-integration/test-interceptor";
import { StreamTransformInterceptor } from "@kronos-integration/interceptor-stream";

const here = dirname(fileURLToPath(import.meta.url));

class MyStreamTransformInterceptor extends StreamTransformInterceptor {
  static get name() {
    return "my-stream-transform";
  }

  createTransformer(endpoint) {
    return createGzip();
  }
}

const e = dummyEndpoint("ep1");

test.skip(
  interceptorTest,
  MyStreamTransformInterceptor,
  undefined,
  { type: "my-stream-transform", json: { type: "my-stream-transform" } },
  e,
  createReadStream(join(here, "fixtures", "sample.txt")),
  () => 77,
  async (t, interceptor, e, next, result) => {}
);
