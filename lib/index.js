#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const utils = require('./utils')

// if .bones directory, do the thing
const [_, __, template, _dest, ...args] = process.argv // eslint-disable-line
const dest = path.relative(process.cwd(), _dest || './')

if (template === 'init') {
  utils.copyRecursive(
    path.join(__dirname, '../.bones'),
    path.join(process.cwd(), '.bones')
  )
  console.log(`☠️  'component' example template installed to ./.bones`)
  console.log('👉 try it out: `bones component Foobar`')
  process.exit(0)
}

const bonesDir = utils.findBones(process.cwd())
// todo - merge '.bones/config.js' with this file
const config = utils.getConfig(bonesDir)
mustache.tags = config.mustacheDelimiters
const templatePath = path.join(bonesDir, template)

if (!fs.existsSync(templatePath)) {
  console.error(`Template '${template}' not found in ${bonesDir}`)
  process.exit(1)
}

const name = path.basename(dest)
const rest = utils.tuplesToObject(args.map(arg => arg.split('=')))

// todo - use a more robust argument parsing library for this part
const templateArgs = {name, ...rest}
console.debug(`templateArgs: '${JSON.stringify(templateArgs)}'`)

utils.renderTemplate(
  templatePath,
  path.relative(process.cwd(), path.dirname(dest)) || './',
  templateArgs,
  config
)
console.log(`✨ finished creating '${template}'`)
