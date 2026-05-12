# New Feature - Create Tag

## Description

The purpose of this new feature is to allow the ability to add new tags on the fly. This will add a new record to the tags table.

## Requirements

1. Create a new slash command, called "/tagadd". Copy the existing file and folder structure for other commands
2. This command should take in a required string, for value, and an optional string, for displayValue. This command will create a new records in the tags table, which should also add that option to the future autocompletes for tags
3. If displayValue is not passed in, then it should default to the value, but with the first letter uppercase. For example, value = "buy" => displayValue = "Buy"
4. On success, return a confirmation message alongside the full task embed, like almost all other commands.
5. Duplicate values should return an ephemeral failure message
6. Create a digest.md of all changes inside of prompts/create-tag