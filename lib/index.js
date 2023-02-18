#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const utils = require('./utils')

// if .bones directory, do the thing
const [_, __, template, _dest, ...args] = process.argv // eslint-disable-line
const dest = path.relative(process.cwd(), _dest || './')

if (template === 'init') {
  if (utils.isDirectory(path.join(process.cwd(), '.bones'))) {
    console.log('✅ Your project is already set up with a .bones folder')
    process.exit()
  }
  utils.copyRecursive(
    path.join(__dirname, '../.bones'),
    path.join(process.cwd(), '.bones')
  )
  console.log(`☠️  'component' example template installed to ./.bones`)
  console.log('👉 try it out: `bones component Foobar`')
  process.exit(0)
}

const bonesDir = utils.findBones(process.cwd())
const config = utils.getConfig(bonesDir)
const templatePath = path.join(bonesDir, template)

if (!fs.existsSync(templatePath)) {
  console.error(`Template '${template}' not found in ${bonesDir}`)
  process.exit(1)
}

const name = path.basename(dest)
// todo - once it's stable, swap to util.parseArgs instead of this:
// https://pawelgrzybek.com/til-node-js-18-3-comes-with-command-line-arguments-parser/
const rest = utils.tuplesToObject(args.map(arg => arg.split('=')))
const templateArgs = {name, ...rest}

// make sure the destination directory exists!
fs.mkdirSync(path.dirname(dest), {recursive: true})

utils.renderTemplate(
  templatePath,
  path.relative(process.cwd(), path.dirname(dest)) || './',
  templateArgs,
  config
)
console.log(`✨ finished creating '${template}'`)
