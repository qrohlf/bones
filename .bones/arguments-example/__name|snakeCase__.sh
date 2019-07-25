#!/bin/sh
# you can pass simple arguments to bones templates.
#
# run `bones arguments-example myExample log="foo bar baz" to try it out`
echo "you setup this template with the name __name__"
echo "and passed it '__log__' for the log argument"
echo "here it is camelCased: __log|camelCase__"
echo "here it is PascalCased: __log|pascalCase__"
echo "here it is snake_cased: __log|snakeCase__"
echo "here it is UPPER_SNAKE_CASED: __log|upperSnakeCase__"
echo "here it is kebab-cased: __log|kebabCase__"
