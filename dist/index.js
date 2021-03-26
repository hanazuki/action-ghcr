module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(526);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 82:
/***/ (function(__unusedmodule, exports) {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 102:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const file_command_1 = __webpack_require__(102);
const utils_1 = __webpack_require__(82);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 526:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = __importStar(__webpack_require__(612));
const fs_1 = __webpack_require__(747);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
const core = __importStar(__webpack_require__(470));
const SERVER = 'ghcr.io';
async function login(token) {
    const login = cp.spawn('docker', ['login', SERVER, '-u', 'octocat', '--password-stdin'], {
        stdio: ['pipe', 'inherit', 'inherit'],
    });
    const stdin = login.stdin;
    if (stdin == null) {
        throw 'BUG';
    }
    stdin.end(token);
    await login;
}
async function build(config) {
    const iidfile = path.join(await fs_1.promises.mkdtemp(os.tmpdir() + path.sep), 'iidfile');
    let args = [config.buildContext];
    args.push('--iidfile', iidfile);
    if (config.file) {
        args.push('--file', config.file);
    }
    await cp.spawn('docker', ['build', ...args], {
        stdio: ['ignore', 'inherit', 'inherit'],
        env: {
            DOCKER_BUILDKIT: '1',
        },
    });
    return fs_1.promises.readFile(iidfile, { encoding: 'ascii' });
}
async function publish(iid, config) {
    const fullName = `${SERVER}/${config.repo}/${config.name}:${config.tag}`;
    await cp.spawn('docker', ['tag', iid, fullName], {
        stdio: ['ignore', 'inherit', 'inherit'],
    });
    await cp.spawn('docker', ['push', fullName], {
        stdio: ['ignore', 'inherit', 'inherit'],
    });
    return fullName;
}
async function run() {
    const token = process.env['GITHUB_TOKEN'];
    const repo = process.env['GITHUB_REPOSITORY'];
    const name = core.getInput('name', { required: true });
    const tag = presence(core.getInput('tag'));
    const buildContext = core.getInput('build_context', { required: true });
    const file = presence(core.getInput('file'));
    if (repo == null) {
        throw 'GITHUB_REPO is not available.';
    }
    if (token != null) {
        await core.group(`Login to GitHub Packages`, () => login(token));
    }
    else {
        if (tag != null) {
            throw 'tag is specified but GITHUB_TOKEN is not available.';
        }
    }
    const imageId = await core.group(`Build ${name}`, () => build({
        buildContext: buildContext,
        file: file,
    }));
    core.info(`Image built as ${imageId}`);
    core.setOutput('image_id', imageId);
    if (tag != null) {
        const imageName = await core.group(`Publish ${name}:${tag}`, () => publish(imageId, {
            repo: repo,
            name: name,
            tag: tag,
        }));
        core.info(`Image published as ${imageName}`);
        core.setOutput('image_name', imageName);
    }
}
function presence(val) {
    return val === '' ? null : val;
}
run().catch(e => core.setFailed(e.message));


/***/ }),

/***/ 612:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisifyChildProcess = promisifyChildProcess;
exports.spawn = spawn;
exports.fork = fork;
exports.execFile = exports.exec = void 0;

const child_process = __webpack_require__(129);

const bindFinally = promise => (handler // don't assume we're running in an environment with Promise.finally
) => promise.then(async value => {
  await handler();
  return value;
}, async reason => {
  await handler();
  throw reason;
});

function joinChunks(chunks, encoding) {
  if (chunks[0] instanceof Buffer) {
    const buffer = Buffer.concat(chunks);
    if (encoding) return buffer.toString(encoding);
    return buffer;
  }

  return chunks.join('');
}

function promisifyChildProcess(child, options = {}) {
  const _promise = new Promise((resolve, reject) => {
    const {
      encoding,
      killSignal
    } = options;
    const captureStdio = encoding != null || options.maxBuffer != null;
    const maxBuffer = options.maxBuffer != null ? options.maxBuffer : 200 * 1024;
    let error;
    let bufferSize = 0;
    const stdoutChunks = [];
    const stderrChunks = [];

    const capture = chunks => data => {
      const remaining = Math.max(0, maxBuffer - bufferSize);
      const byteLength = Buffer.byteLength(data, 'utf8');
      bufferSize += Math.min(remaining, byteLength);

      if (byteLength > remaining) {
        error = new Error(`maxBuffer size exceeded`); // $FlowFixMe

        child.kill(killSignal ? killSignal : 'SIGTERM');
        data = data.slice(0, remaining);
      }

      chunks.push(data);
    };

    if (captureStdio) {
      if (child.stdout) child.stdout.on('data', capture(stdoutChunks));
      if (child.stderr) child.stderr.on('data', capture(stderrChunks));
    }

    child.on('error', reject);

    function done(code, signal) {
      if (!error) {
        if (code != null && code !== 0) {
          error = new Error(`Process exited with code ${code}`);
        } else if (signal != null) {
          error = new Error(`Process was killed with ${signal}`);
        }
      }

      function defineOutputs(obj) {
        obj.code = code;
        obj.signal = signal;

        if (captureStdio) {
          obj.stdout = joinChunks(stdoutChunks, encoding);
          obj.stderr = joinChunks(stderrChunks, encoding);
        } else {
          const warn = prop => ({
            configurable: true,
            enumerable: true,

            get() {
              /* eslint-disable no-console */
              console.error(new Error(`To get ${prop} from a spawned or forked process, set the \`encoding\` or \`maxBuffer\` option`).stack.replace(/^Error/, 'Warning'));
              /* eslint-enable no-console */

              return null;
            }

          });

          Object.defineProperties(obj, {
            stdout: warn('stdout'),
            stderr: warn('stderr')
          });
        }
      }

      const finalError = error;

      if (finalError) {
        defineOutputs(finalError);
        reject(finalError);
      } else {
        const output = {};
        defineOutputs(output);
        resolve(output);
      }
    }

    child.on('close', done);
  });

  return Object.create(child, {
    then: {
      value: _promise.then.bind(_promise)
    },
    catch: {
      value: _promise.catch.bind(_promise)
    },
    finally: {
      value: bindFinally(_promise)
    }
  });
}

function spawn(command, args, options) {
  return promisifyChildProcess(child_process.spawn(command, args, options), Array.isArray(args) ? options : args);
}

function fork(module, args, options) {
  return promisifyChildProcess(child_process.fork(module, args, options), Array.isArray(args) ? options : args);
}

function promisifyExecMethod(method) {
  return (...args) => {
    let child;

    const _promise = new Promise((resolve, reject) => {
      child = method(...args, (err, stdout, stderr) => {
        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;
          reject(err);
        } else {
          resolve({
            code: 0,
            signal: null,
            stdout,
            stderr
          });
        }
      });
    });

    if (!child) {
      throw new Error('unexpected error: child has not been initialized');
    }

    return Object.create(child, {
      then: {
        value: _promise.then.bind(_promise)
      },
      catch: {
        value: _promise.catch.bind(_promise)
      },
      finally: {
        value: bindFinally(_promise)
      }
    });
  };
}

const exec = promisifyExecMethod(child_process.exec);
exports.exec = exec;
const execFile = promisifyExecMethod(child_process.execFile);
exports.execFile = execFile;


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });