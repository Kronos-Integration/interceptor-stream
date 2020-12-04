/* jslint node: true, esnext: true */
'use strict';

import LineTokenizerInterceptor from './LineTokenizerInterceptor';
import {
  parserFactory
}
from './line-tokenizer';

function registerWithManager(manager) {
  return manager.registerInterceptor(LineTokenizerInterceptor);
}

export {
  parserFactory,
  LineTokenizerInterceptor,
  registerWithManager
};
