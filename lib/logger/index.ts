import { createLogger, format, transports } from "winston";

const logFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  },
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
    process.env.LOG_FORMAT === "development"
      ? format.colorize()
      : format.json(),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

export const logError = (
  error: Error,
  context?: Record<string, unknown>,
): void => {
  logger.error(error.message, {
    stack: error.stack,
    ...context,
  });
};

export const logInfo = (
  message: string,
  context?: Record<string, unknown>,
): void => {
  logger.info(message, context);
};

export const logWarn = (
  message: string,
  context?: Record<string, unknown>,
): void => {
  logger.warn(message, context);
};

export const logDebug = (
  message: string,
  context?: Record<string, unknown>,
): void => {
  logger.debug(message, context);
};

export default logger;
