class Logger {
  private debug = process.env.NEXT_PUBLIC_APP_DEBUG || false

  info(message?: any, ...optionalParams: any[]) {
    if (!this.debug) return

    console.log(message, ...optionalParams)
  }

  error(message?: any, ...optionalParams: any[]) {
    if (!this.debug) return

    console.error(message, ...optionalParams)
  }
}

const logger = new Logger()

export default logger
