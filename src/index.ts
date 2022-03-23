#!/bin/env node

import {main} from './cli';

/** exec main from cli is used as cli */
if (require.main === module) {
  main();
}
