# @qrohlf/bones

![](./bones.gif)

Bones is a small scaffolding utility for code projects. It runs in node, but
can be useful in any kind of project where you find yourself creating the same
set of boilerplate files over and over.

## Getting Started

1. Install bones:

```
npm install -g @qrohlf/bones
```

2. Create the `.bones` folder with an example `component` template:

```
cd ~/myproject
bones init
```

3. Try it out:

```
bones component MyComponent
$EDITOR ./MyComponent
```

4. Add your own 'bones':

```
mkdir .bones/mytemplate
vim .bones/mytemplate/__name__.js
```

## Usage

Bones operates on templates that you define in the `.bones` directory of your
project. These templates can be as simple as a single file, or as complex as
as set of nested directories.

```
bones templatename destination [arg1=value arg2=value...]
```

In filenames, directory names, and template file contents, anything surrounded
by double underscores (i.e. `__name__`) will be replaced with the value you
provided on the command line.

The `__name__` parameter is populated by default with the basename of the
destination argument. You can override this by passing `name=YOURNAME` as part
of the argument list.

There are also a number of string helpers you can use for transforming variables.
The syntax for doing this is `__argName|transformName__` (so, for example `__name|snakeCase__` would be useful if you wanted to take a react ComponentName and transform it to a `class_name` for use in your CSS). The currently available helpers
are:

| helper | output|
| - | - |
|`camelCase`|fooBar|
|`pascalCase`|FooBar|
|`snakeCase`|foo_bar|
|`kebabCase`|foo-bar|
|`upperCase`|FOOBAR|
|`upperSnakeCase`|FOO_BAR|
|`lowerCase`|foobar|

Bones uses a whitelist to determine which files to run through the template
engine and which files to copy. See the [default config](./lib/defaultConfig.js)
for a list of file extensions that are interpreted as templates.

## Examples

You can see some template examples in the [.bones](./.bones) directory of this
repo.

## Customization

You can set per-project configuration values in `.bones/bones.config.js` which
will override the defaults. See the [default config](./lib/defaultConfig.js) for
all of the possible options.

## License

Bones is MIT-licensed
