#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { sync as commandExists } from 'command-exists'
import yargs from 'yargs'
import YTDlpWrap from 'yt-dlp-wrap'

// #region : Functions
function isValidHttpUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

function getFileName(fileName: string): string {
  if (fileName) {
    return fileName
  }

  let retFileName = '1.mp3'
  const dir = process.cwd()
  try {
    const files = fs.readdirSync(dir)

    // Get all mp3 files
    const mp3Files = files.filter(file => path.extname(file) === '.mp3' && !Number.isNaN(path.basename(file, '.mp3')))
    if (mp3Files.length !== 0) {
      const maxFileNum = mp3Files.reduce((maxNum, currentFile) => {
        const currentFileNum = Number.parseInt(path.basename(currentFile, '.mp3'))
        return currentFileNum > maxNum ? currentFileNum : maxNum
      }, 0)
      retFileName = `${maxFileNum + 1}.mp3`
    }
  } catch {
    console.error('Error: Could not list the directory.')
    process.exit(1)
  }
  return retFileName
}
//  #endregion

// #region : Check if yt-dlp, ffmpeg, ffprobe available
const cmdCheckErrMsg: string[] = []
const cmds = ['yt-dlp', 'ffmpeg', 'ffprobe'] as const
cmds.forEach((cmd) => {
  if (!commandExists(cmd)) {
    cmdCheckErrMsg.push(`Error: ${cmd} is not available.`)
  }
})
//  #endregion

// #region : Get arguments
const yargsConfig = yargs(process.argv.slice(2))
  .usage('Usage: ydlmp3 <start time> <end time> <url> [options]')
  .options({
    output: {
      alias: 'o',
      describe: 'The name of the output file name',
    },
  })
  .strictOptions()
  .check((argv) => {
    if (cmdCheckErrMsg.length) {
      // eslint-disable-next-line unicorn/error-message
      throw new Error(cmdCheckErrMsg.join('\n'))
    }
    if (argv._.length !== 3) {
      const errMsg = new Map([
        [0, 'Missing parameter(s)'],
        [1, 'Missing parameter <end time> and <url>'],
        [2, 'Missing <url>'],
      ])
      throw new Error(errMsg.get(argv._.length) || 'Extra parameter(s) given')
    }

    if (!isValidHttpUrl(`${argv._[2]}`)) {
      throw new Error('Invalid url provided')
    }

    return true
  })
  .epilogue('yt-dlp, ffmpeg and ffprobe are required.\nCheck out yt-dlp\'s github for more info: https://github.com/yt-dlp/yt-dlp')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')

// @ts-expect-error @type/yargs isn't well documented
yargsConfig.getOptions().boolean.splice(-2)
const args = yargsConfig.argv
//  #endregion

// #region : Handle output file name
// @ts-expect-error @type/yargs aren't well documented
const newFileName = getFileName(args.output)
if (newFileName === undefined) {
  console.error('Error: Fail to get a file name automatically')
  process.exit(1)
}
//  #endregion

// #region : Download and convert to mp3
// @ts-expect-error @type/yargs isn't well documented
const [startTime, endTime, url] = args._
// eslint-disable-next-line new-cap
const ytDlp = new YTDlpWrap.default()
ytDlp.exec([
  '-x',
  '--audio-format',
  'mp3',
  '--postprocessor-args',
  `-ss ${startTime} -to ${endTime}`,
  '-o',
  newFileName,
  url,
]).on('progress', progress =>
  console.log(
    progress.percent,
    progress.totalSize,
    progress.currentSpeed,
    progress.eta,
  )).on('ytDlpEvent', (eventType, eventData) =>
  console.log(eventType, eventData))
//  #endregion
