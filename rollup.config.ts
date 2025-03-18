import del from 'rollup-plugin-delete'
import esbuild from 'rollup-plugin-esbuild'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'bin',
        entryFileNames: '[name].cjs',
        format: 'cjs',
        sourcemap: false,
      },
    ],
    external: ['child_process'],
    plugins: [
      del({ targets: 'bin/*' }),
      esbuild({
        minify: true,
        drop: ['debugger'],
      }),
    ],
  },
]
