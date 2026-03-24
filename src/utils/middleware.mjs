export const validate = (schema, property) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        error: error.details.map((d) => d.message).join(", "),
      });
    }

    req[property] = value;
    next();
  };
};