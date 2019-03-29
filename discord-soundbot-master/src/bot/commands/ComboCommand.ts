import { Message, VoiceChannel } from 'discord.js';

import Command from './base/Command';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class ComboCommand implements Command {
  public readonly TRIGGERS = ['combo'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !combo <sound1> ... <soundN>';

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;
  private sounds!: string[];

  constructor(soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, params: string[]) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.sounds = this.soundUtil.getSounds();
    this.addSoundsToQueue(params, voiceChannel, message);
  }

  private addSoundsToQueue(sounds: string[], voiceChannel: VoiceChannel, message: Message) {
    sounds.forEach(sound => this.addSoundToQueue(sound, voiceChannel, message));
  }

  private addSoundToQueue(sound: string, voiceChannel: VoiceChannel, message: Message) {
    if (!this.sounds.includes(sound)) return;
    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
