const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Exception = use('Exception');

  Exception.handle('ValidationException', async ({ response }) => {
    response.redirect('back');
  });
});
