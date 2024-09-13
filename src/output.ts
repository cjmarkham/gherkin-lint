import chalk from 'chalk'

import logger from './logger'
import { LintError } from './error'

export interface Results {
  success: boolean
  errors?: Map<string, Array<LintError>>
  schemaErrors?: Map<string, Array<string>>
}

export const outputSchemaErrors = (schemaErrors: Map<string, Array<string>>): void => {
  if (!schemaErrors.size) {
    return
  }

  logger.error(chalk.redBright('Invalid configuration options specified!\n'))
  schemaErrors.forEach((errs, key) => {
    logger.info(chalk.underline(key))
    errs.forEach((e, idx) => {
      logger.info(chalk.gray(`${idx}) `) + e)
    })
  })
}

export const outputErrors = (errors: Map<string, Array<LintError>>): void => {
  chalk.level = 3

  if (!errors.size) {
    return
  }

  let totalErrors = 0
  let totalWarns = 0

  errors.forEach((lintErrors: Array<LintError>, file: string): void => {
    let output = `\n${chalk.underline(file)}`

    lintErrors.forEach((err: LintError) => {
      let color = chalk.yellow
      if (err.severity === 'error') {
        color = chalk.redBright
        totalErrors += 1
      }
      if (err.severity === 'warn') {
        totalWarns += 1
      }

      const errorWithLongestMessage = lintErrors.reduce((a, b) => (a.message.length < b.message.length ? b : a))
      const errorWithLongestLocation = lintErrors.reduce((a, b) =>
        a.location.column.toString().length + a.location.line.toString().length <
        b.location.column.toString().length + b.location.line.toString().length
          ? b
          : a,
      )
      const maxMessageLength = errorWithLongestMessage.message.length
      const maxLocationLength =
        errorWithLongestLocation.location.column.toString().length +
        errorWithLongestLocation.location.line.toString().length

      const location = (err.location.line + ':' + (err.location.column || 0)).toString().padEnd(maxLocationLength + 1)
      output += [
        '\n',
        `${location} ${color(err.severity).padEnd(5)} `,
        err.message.padEnd(maxMessageLength + 1),
        chalk.gray(err.rule),
      ].join('')
    })

    logger.error(output)
  })

  if (totalErrors + totalWarns > 0) {
    let color = chalk.bold.redBright
    if (!totalErrors) {
      color = chalk.bold.yellow
    }
    logger.info(
      color(
        `\nx ${totalErrors + totalWarns} problems (${totalErrors} error${totalErrors ? 's' : ''}, ${totalWarns} warning${totalWarns ? 's' : ''})`,
      ),
    )
  }
}
