const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('A1');
    resolve()
  }, 1000)
});
p.then(() => {
  setTimeout(() => {
    console.log('B1');
  }, 1000)
});