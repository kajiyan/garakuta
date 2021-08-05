console.log('Hello World');

if (module.hot) {
  module.hot.accept((error) => {
    if (error) {
      console.error(error);
    }
  });

  // module.hot.dispose(() => {});
};