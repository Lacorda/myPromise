setTimeout(() => {
  //A动画
  console.log('A');
  setTimeout(() => {
    //B动画
    console.log('B');
  }, 1000)
}, 1000);