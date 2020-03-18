import * as core from '@actions/core'
import {promisify} from 'util';
const exec = promisify(require('child_process').exec);

const SERVER = 'docker.pkg.github.com';

type BuildConfig = {
  build_context: string;
  file: string | null;
};

type PublishConfig = {
  token: string;
  name: string;
  tag: string;
};

async function build(config: BuildConfig): Promise<string> {
  return "a";
}

async function publish(iid: string, config: PublishConfig): Promise<string> {

}

async function run(): Promise<void> {
  const token = process.env['GITHUB_TOKEN'];
  const name = core.getInput('name', {required: true});
  const tag = presence(core.getInput('tag'));
  const build_context = core.getInput('build_context', {required: true});
  const file = presence(core.getInput('file'));

  if(tag !== null && token === null) {
    throw 'tag is specified but GITHUB_TOKEN is not available';
  }

  const image_id = await core.group(`Build ${name}`, () => build({
    build_context: build_context,
    file: file,
  }));

  core.setOutput('image_id', image_id);

  if(tag !== null) {
    const image_name = await core.group(`Publish ${name}:${tag}`, () => publish(image_id, {
      token: token as string,
      name: name,
      tag: tag,
    }));

    core.setOutput('image_name', image_name);
  }
}

function presence(val: string): string | null {
  return val === '' ? val : null;
}

run().catch(e => core.setFailed(e.message));
