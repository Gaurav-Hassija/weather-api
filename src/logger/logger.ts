import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} - [${level.toUpperCase()}] - ${message}`;
});

const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'debug',
  },
};

const devLogger = {
  format: format.combine(
    format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
    format.errors(),
    customFormat,
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file),
  ],
};

export const loggerInstance = createLogger(devLogger);
