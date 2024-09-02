<h2 align="center">Gherklin</h2>

<p align="center">
    A linter for Gherkin, using TypeScript and ESM.
</p>

<p align="center">
<a href="https://github.com/cjmarkham/Gherklin/actions/workflows/tests.yml">
    <img src="https://github.com/cjmarkham/gherkin-lint/actions/workflows/tests.yml/badge.svg">
</a>

<a href="https://github.com/cjmarkham/Gherklin/actions/workflows/linting.yml">
    <img src="https://github.com/cjmarkham/gherkin-lint/actions/workflows/linting.yml/badge.svg">
</a>

<a href="https://github.com/prettier/prettier/tree/c067d27673c6d97d9037eb9b13b74bd8c9324be2?tab=readme-ov-file#badge">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier">
</a>
</p>

<p align="center">
Lint your Gherkin files, with an extensible list of rules. Use the built in rules or create your own. Go nuts, go <strong>Gherklin</strong>.
</p>

# Usage

```shell
npx tsx gherklin
```

# Configuration

Gherklin will look for a `gherklin.config.ts` file in the same directory as your `package.json` file.

This file should default export an object, which contains the parameters for Gherklin.

### Example
```typescript
export default {
  featureDirectory: './features',
  customRulesDirectory: './custom-rules',
  rules: {
    'allowed-tags': 'off',
  },
}
```

| Parameter                     | Type     | Description                                |
|-------------------------------|----------|--------------------------------------------|
| `featureDirectory` (required) | `string` | The folder where your Gherkin features are |
| `customRulesDirectory`        | string   | The directory where your custom rules are  |
| `rules`                       | `object` | Configuration per rule                     |

`rules` contains the configuration for each rule, whether built in or custom. Check [rules](./src/rules) for a list of built in rules.

# Automatic Fixing
**Gherklin** doesn't support automatic fixes that you may be used to with things like ESLint and Prettier.

Why? It's not so simple to fix Gherkin. 
Let's say we have a rule for allowed tags and you have a feature file with a tag that's not allowed. Gherklin
**could** remove this tag, but then that could break the semantic coupling between Gherkin and your step definitions.

Let's take another example, max scenarios. If **Gherklin** finds that a file has too many scenarios, should it delete the whole scenario?

These are a few of the reasons why **Gherklin** doesn't support automatic fix ups.

# Custom Rules
Custom rules can be loaded by setting the `customRulesDirectory` parameter in your config file.

There are a few things needed to consider for rules:
- Each file in the directory contains one rule.
- Each file has at minimum two exports
  - A named constant called schema 
  - A named function called `run`
  
Schema for rules uses [Zod](https://github.com/colinhacks/zod). There are a few different schemas specified in [the schemas file](./src/schema.ts), but if you
want to create something different, you can use Zod directly.
When the rule is loaded, this schema is used to verify the configuration value for the rule.

The `run` function accepts two arguments
- rule: An instance of the [rule class](./src/rule.ts)
- document: The Gherkin Document being validated

The `run` function must return an array of [LintError](./src/error.ts) (or an empty array for no errors).

# Contributing

If you are adding new rules, they must follow the same format as existing rules (see [Custom Rules](#custom-rules)).
Each new rule must have unit and acceptance tests (see [testing](#testing)).

# Testing

Tests use the [Mocha Test Framework](https://mochajs.org/) and live in the [tests](./tests) directory.

Tests can be ran with `npm test`.

Tests are separated in to either unit or acceptance.

Unit tests test the rule function by calling it directly with parameters.

Acceptance tests test the rule and its schema, using test feature files and test config files.
[Sinon](https://sinonjs.org/) is used to stub the current working directory (`cwd`) so we can target specific configuration files.

If you are running tests via an IDE such as IntelliJ, you will need to set some Node options:

```shell
NODE_OPTIONS="--loader ts-node/esm --experimental-specifier-resolution=node --no-warnings"
```

More info as to why can be found on the [ts-node repository](https://github.com/TypeStrong/ts-node/issues/1007)
