Feature: No Trailing Spaces

  Scenario: Trailing space

  If editing this file, make sure your IDE does not trim
  the space on line 11

    Given the following feature file
      """
      Feature: Trailing whitespace
        Scenario: Scenario 1     
          When something happens
          Then something has happened
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"no-trailing-spaces": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule               | message                    |
      | {"line": 2, "column": 25} | error    | no-trailing-spaces | Found trailing whitespace. |

  Scenario: Auto fix

  If editing this file, make sure your IDE does not trim
  the space on line 31

    Given the following feature file
      """
      Feature: Trailing whitespace
        Scenario: Scenario 1     
          When something happens
          Then something has happened
      """
    When Gherklin is ran with the following configuration
      | rules                           | fix  |
      | {"no-trailing-spaces": "error"} | true |
    Then there are 0 files with errors
