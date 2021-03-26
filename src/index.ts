import * as cp from 'promisify-child-process';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core'

const SERVER = 'ghcr.io';

type BuildConfig = {
  buildContext: string;
  file: string | null;
};

type PublishConfig = {
  repo: string;
  name: string;
  tag: string;
};

async function login(token: string): Promise<void> {
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

async function build(config: BuildConfig): Promise<string> {
  const iidfile = path.join(await fs.mkdtemp(os.tmpdir() + path.sep), 'iidfile');

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

  return fs.readFile(iidfile, { encoding: 'ascii' });
}

async function publish(iid: string, config: PublishConfig): Promise<string> {
  const fullName = `${SERVER}/${config.repo}/${config.name}:${config.tag}`;

  await cp.spawn('docker', ['tag', iid, fullName], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  await cp.spawn('docker', ['push', fullName], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  return fullName;
}

async function run(): Promise<void> {
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
  } else {
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

function presence(val: string): string | null {
  return val === '' ? null : val;
}

run().catch(e => core.setFailed(e.message));
