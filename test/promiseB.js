const PromiseB = require('../promiseB');
const p = new PromiseB((resolve, reject) => {
  setTimeout(() => {
    console.log('A2');
    resolve()
  }, 1000)
});
p.then(() => {
  setTimeout(() => {
    console.log('B2');
  }, 1000)
});