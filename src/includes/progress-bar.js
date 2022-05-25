import NProgess from 'nprogress';

export default (router) => {
  router.beforeEach((to, from, next) => {
    NProgess.start();
    next();
  });
  router.afterEach(NProgess.done());
  // router.afterEach(NProgess.done);
};
