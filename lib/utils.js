const path = require('path')
const os = require('os')
const fs = require('fs')
const USER_HOMEDIR = path.resolve(os.homedir())
const _ = require('lodash')

const tuplesToObject = tuples => (
  tuples.reduce((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
)

const isDirectory = (filePath) => {
  try {
    return fs.lstatSync(filePath).isDirectory()
  } catch (e) {
    return false
  }
}

// Starting in the current directory, spider UP the directory tree until
// a directory with a .bones or .git subdirectory is found
const findBones = (pwd) => {
  const bones = path.join(pwd, '.bones')
  if (isDirectory(bones)) {
    return bones
  } else if (path.resolve(pwd) === USER_HOMEDIR || path.resolve(pwd) === '/') {
    console.error('No .bones folder found.')
    process.exit(1)
  } else {
    return findBones(path.resolve(pwd, '../'))
  }
}

const getConfig = (bonesDir) => {
  const config = require('./defaultConfig')
  const userConfigPath = path.join(bonesDir, 'bones.config.js')
  if (fs.existsSync(userConfigPath)) {
    const userConfig = require(userConfigPath)
    Object.assign(config, userConfig)
  }
  return config
}

const copyRecursive = (sourcePath, destPath, log = false) => {
  if (isDirectory(sourcePath)) {
    fs.mkdirSync(destPath)
    fs.readdirSync(sourcePath)
      .forEach(subpath => copyRecursive(
        path.join(sourcePath, subpath),
        path.join(destPath, subpath)
      ))
  } else {
    log && console.log(`${sourcePath} -> ${destPath}`)
    fs.copyFileSync(sourcePath, destPath)
  }
}

const templateHelpers = {
  camelCase: _.camelCase,
  pascalCase: (str) => _.upperFirst(_.camelCase(str)),
  snakeCase: _.snakeCase,
  kebabCase: _.kebabCase,
  capitalize: _.capitalize,
  upperFirst: _.upperFirst
}

const processTemplateString = (path, templateArgs) => (
  Object.keys(templateArgs).reduce((s, key) => {
    const regexSafeKey = _.escapeRegExp(key)
    const regexStr = `__${regexSafeKey}(?:\\|([A-Za-z]+))?__`
    const search = new RegExp(regexStr, 'g')
    const templateArg = templateArgs[key]
    // console.log(`using regex ${search}`)
    return s.replace(search, (match, fn) => (
      fn
        ? templateHelpers[fn](templateArg)
        : templateArg
    ))
  }, path)
)

const renderTemplate = (sourcePath, _destPath, templateArgs, config) => {
  const destPath = processTemplateString(_destPath, templateArgs)

  if (isDirectory(sourcePath)) {
    if (!isDirectory(destPath)) { fs.mkdirSync(destPath) }
    fs.readdirSync(sourcePath)
      .forEach(subpath => renderTemplate(
        path.join(sourcePath, subpath),
        path.join(destPath, subpath),
        templateArgs,
        config)
      )
  } else if (config.templateFiles.includes(path.extname(sourcePath))) {
    console.log(`⌨️  template: ${destPath}`)
    const template = fs.readFileSync(sourcePath, 'utf8')
    const mode = fs.statSync(sourcePath).mode
    const rendered = processTemplateString(template, templateArgs)
    fs.writeFileSync(destPath, rendered, {mode}) // todo overwrite prompt?
  } else {
    console.log(`🔢 file: ${destPath}`)
    fs.copyFileSync(sourcePath, destPath) // todo overwrite prompt?
  }
}

module.exports = {
  isDirectory,
  tuplesToObject,
  findBones,
  getConfig,
  copyRecursive,
  processTemplateString,
  renderTemplate
}
