export default (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map((x) => {
      const { path, message } = x;
      return { path, message };
    });
  }
  return [{ path: 'name', message: 'something went wrong' }];
};
