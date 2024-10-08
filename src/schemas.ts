import { z } from 'zod'

import { Severity, Switch } from './types'

export const keywordInts = z
  .object({
    feature: z.number(),
    background: z.number(),
    scenario: z.number(),
    step: z.number(),
    examples: z.number(),
    given: z.number(),
    when: z.number(),
    then: z.number(),
    and: z.number(),
    but: z.number(),
    exampleTableHeader: z.number(),
    exampleTableBody: z.number(),
  })
  .partial()
  .strict()

// warn | error
export const severitySchema = z.nativeEnum(Severity)
// on | off | warn | error
export const switchOrSeveritySchema = z.union([z.nativeEnum(Switch), z.nativeEnum(Severity)])

export const switchOrSeverityorSeverityAndStringSchema = z.union([
  z.nativeEnum(Switch),
  z.nativeEnum(Severity),
  z.tuple([z.nativeEnum(Severity), z.string()]),
])

// off | on | error | warn | [error | warn, string]
export const offOrStringArrayOrSeverityAndStringArray = z.union([
  z.literal(Switch.off),
  z.string().array(),
  z.tuple([severitySchema, z.string().array()]),
])
//  off | keywordInts | [warn | error, keywordInts]
export const offOrKeywordIntsOrSeverityAndKeywordInts = z.union([
  z.literal(Switch.off),
  keywordInts,
  z.tuple([z.nativeEnum(Severity), keywordInts]),
])
export const offOrNumberOrSeverityAndNumber = z.union([
  z.literal(Switch.off),
  z.number(),
  z.tuple([z.nativeEnum(Severity), z.number()]),
])
export const offOrNumberOrSeverityOrSeverityAndNumber = z.union([
  z.literal(Switch.off),
  z.number(),
  z.nativeEnum(Severity),
  z.tuple([z.nativeEnum(Severity), z.number()]),
])
