#!/usr/bin/env node
import fs from "fs";
import path from "path";
import yargs from "yargs";
import commandExists from "command-exists";
import YTDlpWrap from "yt-dlp-wrap";

// #region : Functions
function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function getFileName(fileName) {
  if (fileName) return fileName;

  let retFileName = "1.mp3";
  const dir = process.cwd();
  try {
    const files = await fs.promises.readdir(dir);

    // Get all mp3 files
    const mp3Files = files.filter(file => path.extname(file) === ".mp3" && !isNaN(path.basename(file, ".mp3")));
    if (mp3Files.length !== 0) {
      const maxFileNum = mp3Files.reduce((maxNum, currentFile) => {
        const currentFileNum = parseInt(path.basename(currentFile, ".mp3"));
        return currentFileNum > maxNum ? currentFileNum : maxNum;
      }, 0);
      retFileName = maxFileNum + 1 + ".mp3";
    }
  } catch {
    console.error("Error: Could not list the directory.");
    process.exit(1);
  }
  return retFileName;
}
//  #endregion

// #region : Check if yt-dlp, ffmpeg, ffprobe available
const cmds = ["yt-dlp", "ffmpeg", "ffprobe"];
const res = await Promise.allSettled(cmds.map(cmd => commandExists(cmd)));
const cmdCheckErrMsg = [];
res.forEach((item, index) => {
  if (item.status === "rejected") cmdCheckErrMsg.push(`Error: ${cmds[index]} is not available.`);
});
//  #endregion

// #region : Get arguments
const yargsConfig = yargs(process.argv.slice(2))
  .usage("Usage: ydlmp3 <start time> <end time> <url> [options]")
  .options({
    "output": {
      alias: "o",
      describe: "The name of the output file name",
    }
  })
  .strictOptions()
  .check(argv => {
    if (cmdCheckErrMsg.length) throw new Error(cmdCheckErrMsg.join("\n"));
    if (argv._.length !== 3) {
      const errMsg = new Map([
        [0, "Missing parameter(s)"],
        [1, "Missing parameter <end time> and <url>"],
        [2, "Missing <url>"],
      ]);
      throw new Error(errMsg.get(argv._.length) || "Extra parameter(s) given");
    }

    if (!isValidHttpUrl(argv._[2])) throw new Error("Invalid url provided");

    return true;
  })
  .epilogue("yt-dlp, ffmpeg and ffprobe are required.\nCheck out yt-dlp's github for more info: https://github.com/yt-dlp/yt-dlp")
  .help().alias("h", "help")
  .version().alias("v", "version");

yargsConfig.getOptions().boolean.splice(-2);
const args = yargsConfig.argv;
//  #endregion

// #region : Handle output file name
const newFileName = await getFileName(args.output);
if (newFileName === undefined) {
  console.error("Error: Fail to get a file name automatically");
  process.exit(1);
}
//  #endregion

// #region : Download and convert to mp3
const [startTime, endTime, url] = args._;
const ytDlp = new YTDlpWrap.default();
const ytDlpRes = await ytDlp.exec([
  "-x",
  "--audio-format", "mp3",
  "--postprocessor-args", `-ss ${startTime} -to ${endTime}`,
  "-o", newFileName,
  url,
]).on("progress", (progress) =>
  console.log(
    progress.percent,
    progress.totalSize,
    progress.currentSpeed,
    progress.eta
  )
).on("ytDlpEvent", (eventType, eventData) =>
  console.log(eventType, eventData)
);
//  #endregion
