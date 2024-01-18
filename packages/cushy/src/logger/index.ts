import { bold, red, yellow, white } from './terminal-color';

const prefixes = {
  info: white(bold(' ')),
  warn: yellow(bold('⚠')),
  error: red(bold('⨯')),
} as const;

const LOGGING_METHOD = {
  log: 'log',
  warn: 'warn',
  error: 'error',
} as const;

function prefixedLog(prefixType: keyof typeof prefixes, ...message: any[]) {
  if ((message[0] === '' || message[0] === undefined) && message.length === 1) {
    message.shift();
  }

  const consoleMethod: keyof typeof LOGGING_METHOD = prefixType in LOGGING_METHOD ? LOGGING_METHOD[prefixType as keyof typeof LOGGING_METHOD] : 'log';

  const prefix = prefixes[prefixType];
  // If there's no message, don't print the prefix but a new line
  if (message.length === 0) {
    console[consoleMethod]('');
  } else {
    console[consoleMethod](' ' + prefix, ...message);
  }
}

export function bootstrap(...message: any[]) {
  console.log(' ', ...message);
}

export function info(...message: any[]) {
  prefixedLog('info', ...message);
}

export function warn(...message: any[]) {
  prefixedLog('warn', ...message);
}

export function error(...message: any[]) {
  prefixedLog('error', ...message);
}
