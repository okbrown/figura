#!/usr/bin/env node
"use strict";

const fs = require('fs')
const path = require('path')
const get = require('lodash/get')
const argv = require('minimist')(process.argv.slice(2))
const { latest, latestLTS } = require('nodejs-latest')

const createFile = async (file, nodeVersion) => {
	let content;
	switch (file){
		case 'nvmrc':
			let { version } = await getNodeVersion(nodeVersion)
			content = version
			break
		case 'babelrc':
			content = getCodeString(file)
			break
		default:
			return
	}

	const fileName = getFile(file).fileName

	fs.writeFile(fileName, content, (err) => {
		if(err) {
			return err
		}
	})
}

const babelrc = {
	name: 'babelrc',
	fileName:'.babelrc',
	code: {
		"presets": ["env"]
	}
}

const nvmrc = {
	name: 'nvmrc',
	fileName: '.nvmrc'
}

const getFile = (file) => {
	const files = {
		babelrc,
		nvmrc
	}
	return files[file]
}

//const getCode = file => getFile(file).code

const getCodeString = file =>
	JSON.stringify(getFile(file).code, null, '\t')

const getNodeVersion = (type) =>{
	return new Promise((resolve, reject) => {
		if (type === 'latest'){
			resolve(latest())
		}
		else if(type === 'stable') {
			resolve(latestLTS())
		}
	})
}

if(argv['m'] === get(getFile(argv['m']), 'name')){
	createFile(argv['m'], argv['v'])
}
else {
	console.log(' Error: That command does not exist')
}
