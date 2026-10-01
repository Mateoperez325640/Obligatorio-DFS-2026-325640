import { mensajesJoi } from "../config/joi-message.js";

export const validateRequest = (schema, reqKey) => {
    return (req, res, next) => {
        const objetoAValidar = req[reqKey];

        const { error, value } = schema.validate(objetoAValidar, {
            abortEarly: false,
            messages: mensajesJoi,
        });

        if (error) {
            return next(error);
        }

        if (reqKey === "query") {
            res.locals.validatedQuery = value;
        } else {
            req[reqKey] = value;
        }

        return next();
    };
};

const validate = (schema) => {
    return validateRequest(schema, "body");
};

export const validateParams = (schema) => {
    return validateRequest(schema, "params");
};

export const validateQuery = (schema) => {
    return validateRequest(schema, "query");
};

export default validate;