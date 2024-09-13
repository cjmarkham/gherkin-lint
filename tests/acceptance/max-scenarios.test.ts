import { expect } from 'chai'
import { Runner } from '../../src/index'
import path from 'node:path'

describe('Max Scenarios', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/max-scenarios')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'max-scenarios': 1,
      },
    })

    await runner.init()
    const result = await runner.run()

    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)
    expect(result.errors.has(`${featureDirectory}/valid.feature`)).to.eq(false)

    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Expected max 1 scenarios per file. Found 2.')
  })
})
