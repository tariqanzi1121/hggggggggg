import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';

export default class RemoveCommand implements Command {
  public readonly TRIGGERS = ['remove'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !remove <sound>';

  private readonly localeService: LocaleService;
  private readonly soundUtil: SoundUtil;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, soundUtil: SoundUtil, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.soundUtil = soundUtil;
    this.db = db;
  }

  public run(message: Message, params: string[]) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!this.soundUtil.soundExists(sound)) {
      message.channel.send(this.localeService.t('commands.remove.notFound', { sound }));
      return;
    }

    const file = this.soundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    this.db.sounds.remove(sound);

    message.channel.send(this.localeService.t('commands.remove.success', { sound }));
  }
}
