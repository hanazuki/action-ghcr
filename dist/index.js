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

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 335:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(764);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisifyChildProcess = promisifyChildProcess;
exports.spawn = spawn;
exports.fork = fork;
exports.execFile = exports.exec = void 0;

var _child_process = _interopRequireDefault(__webpack_require__(129));

function joinChunks(chunks, encoding) {
  if (chunks[0] instanceof Buffer) {
    var buffer = Buffer.concat(chunks);
    if (encoding) return buffer.toString(encoding);
    return buffer;
  }

  return chunks.join('');
}

function promisifyChildProcess(child) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _promise = new Promise(function (resolve, reject) {
    var encoding = options.encoding,
        killSignal = options.killSignal;
    var captureStdio = encoding != null || options.maxBuffer != null;
    var maxBuffer = options.maxBuffer || 200 * 1024;
    var error;
    var bufferSize = 0;
    var stdoutChunks = [];
    var stderrChunks = [];

    var capture = function capture(chunks) {
      return function (data) {
        var remaining = maxBuffer - bufferSize;

        if (data.length > remaining) {
          error = new Error("maxBuffer size exceeded"); // $FlowFixMe

          child.kill(killSignal ? killSignal : 'SIGTERM');
          data = data.slice(0, remaining);
        }

        bufferSize += data.length;
        chunks.push(data);
      };
    };

    if (captureStdio) {
      if (child.stdout) child.stdout.on('data', capture(stdoutChunks));
      if (child.stderr) child.stderr.on('data', capture(stderrChunks));
    }

    child.on('error', reject);

    function done(code, signal) {
      if (!error) {
        if (code != null && code !== 0) {
          error = new Error("Process exited with code ".concat(code));
        } else if (signal != null) {
          error = new Error("Process was killed with ".concat(signal));
        }
      }

      function defineOutputs(obj) {
        if (captureStdio) {
          obj.stdout = joinChunks(stdoutChunks, encoding);
          obj.stderr = joinChunks(stderrChunks, encoding);
        } else {
          /* eslint-disable no-console */
          Object.defineProperties(obj, {
            stdout: {
              configurable: true,
              enumerable: true,
              get: function get() {
                console.error(new Error("To get stdout from a spawned or forked process, set the `encoding` or `maxBuffer` option").stack.replace(/^Error/, 'Warning'));
                return null;
              }
            },
            stderr: {
              configurable: true,
              enumerable: true,
              get: function get() {
                console.error(new Error("To get stderr from a spawned or forked process, set the `encoding` or `maxBuffer` option").stack.replace(/^Error/, 'Warning'));
                return null;
              }
            }
          });
          /* eslint-enable no-console */
        }
      }

      var output = {};
      defineOutputs(output);
      var finalError = error;

      if (finalError) {
        finalError.code = code;
        finalError.signal = signal;
        defineOutputs(finalError);
        reject(finalError);
      } else {
        resolve(output);
      }
    }

    child.on('close', done);
    child.on('exit', done);
  });

  return Object.create(child, {
    then: {
      value: _promise.then.bind(_promise)
    },
    catch: {
      value: _promise.catch.bind(_promise)
    }
  });
}

function spawn(command, args, options) {
  return promisifyChildProcess(_child_process.default.spawn(command, args, options), Array.isArray(args) ? options : args);
}

function fork(module, args, options) {
  return promisifyChildProcess(_child_process.default.fork(module, args, options), Array.isArray(args) ? options : args);
}

function promisifyExecMethod(method) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var child;

    var _promise = new Promise(function (resolve, reject) {
      child = method.apply(void 0, args.concat([function (err, stdout, stderr) {
        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;
          reject(err);
        } else {
          resolve({
            stdout: stdout,
            stderr: stderr
          });
        }
      }]));
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
      }
    });
  };
}

var exec = promisifyExecMethod(_child_process.default.exec);
exports.exec = exec;
var execFile = promisifyExecMethod(_child_process.default.execFile);
exports.execFile = execFile;

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
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
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
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
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
    command_1.issueCommand('add-path', {}, inputPath);
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
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
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
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
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
 * @param     value    value to store
 */
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

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = __importStar(__webpack_require__(335));
const fs_1 = __webpack_require__(747);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
const core = __importStar(__webpack_require__(470));
const SERVER = 'docker.pkg.github.com';
async function login(token) {
    const login = cp.spawn('docker', ['login', SERVER, '-u', 'octocat', '--password-stdin'], {
        stdio: ['pipe', 'inherit', 'inherit'],
    });
    const stdin = login.stdin;
    if (stdin == null) {
        throw 'BUG';
    }
    stdin.write(token);
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
    if (tag != null) {
        throw 'tag is specified but GITHUB_TOKEN is not available.';
    }
    const imageId = await core.group(`Build ${name}`, () => build({
        buildContext: buildContext,
        file: file,
    }));
    core.setOutput('image_id', imageId);
    if (tag !== null) {
        await core.group(`Login to GitHub Packages`, () => login(token));
        const imageName = await core.group(`Publish ${name}:${tag}`, () => publish(imageId, {
            repo: repo,
            name: name,
            tag: tag,
        }));
        core.setOutput('image_name', imageName);
    }
}
function presence(val) {
    return val === '' ? val : null;
}
run().catch(e => core.setFailed(e.message));


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 764:
/***/ (function(module) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ })

/******/ });