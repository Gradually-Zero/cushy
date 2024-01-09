export type ReportingSeverity = 'ignore' | 'log' | 'warn' | 'throw';

type InterpolatableValue = string | number | (string | number)[];

const path = (msg: unknown): string => `\u001b[36m\u001b[4m${`"${String(msg)}"`}\u001b[24m\u001b[39m`;
const url = (msg: unknown): string => `\u001b[36m\u001b[4m${msg}\u001b[24m\u001b[39m`;
const name = (msg: unknown): string => `\u001b[34m\u001b[1m${msg}\u001b[22m\u001b[39m`;
const code = (msg: unknown): string => `\u001b[36m${`\`${String(msg)}\``}\u001b[39m`;
const subdue = (msg: unknown): string => `\u001b[90m${msg}\u001b[39m`;
const num = (msg: unknown): string => `\u001b[33m${msg}\u001b[39m`;

function interpolate(msgs: TemplateStringsArray, ...values: InterpolatableValue[]): string {
  let res = '';
  values.forEach((value, idx) => {
    const flag = msgs[idx]!.match(/[a-z]+=$/);
    res += msgs[idx]!.replace(/[a-z]+=$/, '');
    const format = (() => {
      if (!flag) {
        return (a: string | number) => a;
      }
      switch (flag[0]) {
        case 'path=':
          return path;
        case 'url=':
          return url;
        case 'number=':
          return num;
        case 'name=':
          return name;
        case 'subdue=':
          return subdue;
        case 'code=':
          return code;
        default:
          throw new Error('Bad Cushy logging message. This is likely an internal bug, please report it.');
      }
    })();
    res += Array.isArray(value) ? `\n- ${value.map((v) => format(v)).join('\n- ')}` : format(value);
  });
  res += msgs.slice(-1)[0];
  return res;
}

function stringify(msg: unknown): string {
  if (String(msg) === '[object Object]') {
    return JSON.stringify(msg);
  }
  if (msg instanceof Date) {
    return msg.toUTCString();
  }
  return String(msg);
}

function info(msg: unknown): void;
function info(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function info(msg: unknown, ...values: InterpolatableValue[]): void {
  console.info(
    `\u001b[36m\u001b[1m${'[INFO]'}\u001b[22m\u001b[39m ${values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)}`
  );
}

function warn(msg: unknown): void;
function warn(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function warn(msg: unknown, ...values: InterpolatableValue[]): void {
  console.warn(
    `\u001b[33m${`\u001b[1m${'[WARNING]'}\u001b[22m ${values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)}`}\u001b[39m`
  );
}

function error(msg: unknown): void;
function error(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function error(msg: unknown, ...values: InterpolatableValue[]): void {
  console.error(
    `\u001b[31m${`\u001b[1m${'[ERROR]'}\u001b[22m ${values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)}`}\u001b[39m`
  );
}

function success(msg: unknown): void;
function success(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function success(msg: unknown, ...values: InterpolatableValue[]): void {
  console.log(
    `\u001b[32m\u001b[1m${'[SUCCESS]'}\u001b[22m\u001b[39m ${values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)}`
  );
}

function throwError(msg: unknown): void;
function throwError(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function throwError(msg: unknown, ...values: InterpolatableValue[]): void {
  throw new Error(values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values));
}

function newLine(): void {
  console.log();
}

/**
 * Takes a message and reports it according to the severity that the user wants.
 *
 * - `ignore`: completely no-op
 * - `log`: uses the `INFO` log level
 * - `warn`: uses the `WARN` log level
 * - `throw`: aborts the process, throws the error.
 *
 * Since the logger doesn't have logging level filters yet, these severities
 * mostly just differ by their colors.
 *
 * @throws In addition to throwing when `reportingSeverity === "throw"`, this
 * function also throws if `reportingSeverity` is not one of the above.
 */
function report(reportingSeverity: ReportingSeverity): typeof success {
  const reportingMethods = {
    ignore: () => {},
    log: info,
    warn,
    throw: throwError,
  };
  if (!Object.prototype.hasOwnProperty.call(reportingMethods, reportingSeverity)) {
    throw new Error(`Unexpected "reportingSeverity" value: ${reportingSeverity}.`);
  }
  return reportingMethods[reportingSeverity];
}

const logger = {
  red: (msg: string | number): string => `\u001b[31m${msg}\u001b[39m`,
  yellow: (msg: string | number): string => `\u001b[33m${msg}\u001b[39m`,
  green: (msg: string | number): string => `\u001b[32m${msg}\u001b[39m`,
  bold: (msg: string | number): string => `\u001b[1m${msg}\u001b[22m`,
  dim: (msg: string | number): string => `\u001b[2m${msg}\u001b[22m`,
  path,
  url,
  name,
  code,
  subdue,
  num,
  interpolate,
  info,
  warn,
  error,
  success,
  report,
  newLine,
};

export default logger;
