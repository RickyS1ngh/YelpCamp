function wrapper(func) {
  //Wrapper Function that runs the asynchrous function and catches the error and calls next error handling middleware
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
}

module.exports = wrapper;
