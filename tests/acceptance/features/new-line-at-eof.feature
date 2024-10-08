Feature: New Line at EOF

  Scenario: No new line
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"new-line-at-eof": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule            | message                     |
      | {"line": 2, "column": 0} | error    | new-line-at-eof | No new line at end of file. |

  Scenario: Has new line
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One

      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"new-line-at-eof": "error"} |
    Then there is 0 files with errors

  Scenario: Auto fix
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
      """
    When Gherklin is ran with the following configuration
      | rules                        | fix  |
      | {"new-line-at-eof": "error"} | true |
    Then there is 0 files with errors
