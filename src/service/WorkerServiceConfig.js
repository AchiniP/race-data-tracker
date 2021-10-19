const { workerData } = require('worker_threads');
require('@babel/register');
require(workerData.path);
