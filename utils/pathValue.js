module.exports = function(obj, path, difault /* can't be "default" */) {
  const info = path.substring(1).split("/");

  let context = obj;

  info.every((key, index) => {
    if (context[key] || context["*"]) {
      context = context[key] || context["*"];
    } else {
      context = difault || null;
      return false;
    }

    return true;
  });

  return (
    context ||
    {
      /* context may be null */
    }
  )._callback
    ? context
    : difault;
};
