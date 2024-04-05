/**
 * all config objects should be re-exported from here. This way, when the whole
 * file is loaded at startup, if any environment variables etc. are missing
 * these errors will propagate at application startup.
 */
export { serverConfig } from './serverConfig'
