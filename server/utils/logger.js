const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  info:  (...args) => isDev && console.log('[INFO]', new Date().toISOString(), ...args),
  warn:  (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
  error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
  debug: (...args) => isDev && console.debug('[DEBUG]', new Date().toISOString(), ...args),
};

export default logger;