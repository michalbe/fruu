import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: 'FRUU',
  dest: 'dist/fruu.js',
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      // open: true,
      contentBase: ['public', 'dist']
    }),
    livereload({
      watch: ['dist', 'public']
    })
  ],
};
