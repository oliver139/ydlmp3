# ydlmp3
A cli tool using yt-dlp to download and clip videos, then convert to mp3.

```
Usage: ydlmp3 <start time> <end time> <url> [options]

Options:
  -o, --output   The name of the output file name
  -h, --help     Show help
  -v, --version  Show version number
```

if `--output` is not provided, the program will try to go through all the mp3 files with numeric name (e.g. `123.mp3`) and use the next value of the biggest number.

`1.mp3` will be used if there is no such file found.

(e.g. If the directory has `1.mp3`, `2.mp3` and `3.mp3`, the program will use `4.mp3` for the new file)

## Requirement
The following commands is required:
- yt-dlp: https://github.com/yt-dlp/yt-dlp
- ffmpeg: https://ffmpeg.org/download.html
- ffprobe: https://ffmpeg.org/download.html

## Project Setup
PNPM with node 18.18.1 is used.

```sh
pnpm install
```

### Install the bin to the global folder
```sh
pnpm link -g
```

### Lint with [ESLint](https://eslint.org/)
```sh
pnpm lint
```
