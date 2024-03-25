import { HttpException, HttpStatus } from '@nestjs/common';
import * as Joi from 'joi';
import { IAddLocation, IUpdateLocation } from '../interface/request_body';
const joiConfig = {
  abortEarly: false,
};

const parseErrorsFromJoi = (error) => {
  return (
    error?.details?.map((each) => ({
      field: each?.context?.label,
      message: each?.message,
    })) || []
  );
};

const addLocationValidator = async (body: IAddLocation) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    });
    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const updateLocationValidator = async (body: IUpdateLocation) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).required(),
    })
      .or('name', 'latitude', 'longitude')
      .required();

    await schema.validateAsync(body, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const forecastWeather = async (pathParams) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    await schema.validateAsync(pathParams, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

const forecastHistory = async (queryParams) => {
  try {
    const schema = Joi.object({
      days: Joi.number().required().min(1).max(15),
    });

    await schema.validateAsync(queryParams, joiConfig);
  } catch (err) {
    throw new HttpException(parseErrorsFromJoi(err), HttpStatus.BAD_REQUEST);
  }
};

export {
  addLocationValidator,
  updateLocationValidator,
  forecastWeather,
  forecastHistory,
};
