#!/usr/bin/env node

import { Command } from 'commander';

import { dev } from '../lib/index.js';

const cli = new Command();

cli.command('dev').description('Start the development server.').option('--config <config>', 'path to config file (default: `./cushy.config.js`)').action(dev);

cli.parse();