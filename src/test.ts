/*
  Convenience wrapper around tape that sets up Sinon sandboxing.
  Handles call test.end for us.
*/

import test = require('tape');
import { Test } from 'tape'; // Type
import * as sinon from 'sinon';

export type TestCase =
  (assert: Test, sandbox: sinon.SinonSandbox) => void|Promise<void>;

export default function(name: string, tc: TestCase) {
  test(name, t => {
    const sandbox = sinon.sandbox.create();
    Promise.resolve(tc(t, sandbox)).then(
      () => {
        sandbox.restore();
        t.end();
      },

      (err) => {
        sandbox.restore();
        console.error(err); // Get proper stack trace
        t.error(err);
      });
  });
}
