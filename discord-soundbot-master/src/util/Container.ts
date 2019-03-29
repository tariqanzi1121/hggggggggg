import * as awilix from 'awilix';

import path from 'path';

import Config from '@config/Config';
import SoundQueue from '@queue/SoundQueue';
import DatabaseAdapter from '@util/db/DatabaseAdapter';
import i18n from '@util/i18n/i18n';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';
import CommandCollection from '../bot/CommandCollection';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC
});

container.register({
  config: awilix.asClass(Config).singleton(),

  i18nProvider: awilix.asValue(i18n),
  localeService: awilix.asClass(LocaleService).singleton(),

  db: awilix.asClass(DatabaseAdapter).singleton(),
  queue: awilix.asClass(SoundQueue).singleton(),
  soundUtil: awilix.asClass(SoundUtil).singleton()
});

container.loadModules([
  'bot/**/*.js'
], {
  cwd: path.join(__dirname, '..'),
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: awilix.Lifetime.SINGLETON,
    register: awilix.asClass
  }
});

container.register({
  chunker: awilix.aliasTo('messageChunker'),
  commands: awilix.asClass(CommandCollection).singleton().inject(() => ({
    commands: [
      container.cradle.pingCommand,

      container.cradle.addCommand,
      container.cradle.renameCommand,
      container.cradle.removeCommand,

      container.cradle.soundCommand,
      container.cradle.comboCommand,
      container.cradle.randomCommand,
      container.cradle.stopCommand,

      container.cradle.entranceCommand,

      container.cradle.soundsCommand,
      container.cradle.searchCommand,
      container.cradle.tagCommand,
      container.cradle.tagsCommand,
      container.cradle.downloadCommand,

      container.cradle.welcomeCommand,
      container.cradle.helpCommand,
      container.cradle.lastAddedCommand,
      container.cradle.mostPlayedCommand,
      container.cradle.ignoreCommand,
      container.cradle.unignoreCommand,

      container.cradle.avatarCommand,
      container.cradle.configCommand
    ]
  }))
});

export default container;
