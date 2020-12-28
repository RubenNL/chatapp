import commonjs from '@rollup/plugin-commonjs';
import fg from 'fast-glob';

import del from 'rollup-plugin-delete'
import {terser} from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy'
import css from 'rollup-plugin-css-only';
import { nodeResolve } from '@rollup/plugin-node-resolve';
const production=process.env.NODE_ENV=="production"
console.log("ENVIRONMENT:",production?'prod':'dev')
export default {
	input: 'src/index.js',
	treeshake:production,
	output: {
		dir: 'output',
		format: 'es'
	},
	watch: {
//		include: 'src/js/*',
		exclude: 'node_modules/**, server/**'
	},
	preserveEntrySignatures: "allow-extension",
	plugins: [
		del({targets: 'output/*'}),
		nodeResolve({moduleDirectories:['node_modules','src']}),
		commonjs(),
		css({output: 'bundle.css'}),
		copy({
			targets: [
				{src:'src/images/*',dest:'output/images'},
				{src:'src/manifest.json',dest:'output'},
				{src:'src/service-worker.js',dest:'output'},
				{src:'src/index.html',dest:'output'},
				{src:'src/js/sendAuthenticated.js',dest:'output'},
				{src:'robots.txt',dest:'output'},
			]
		}),
		...production?[terser()]:[
			{
				name: 'watch-external',
				async buildStart(){
					const files = await fg('src/**');
					for(let file of files){
						this.addWatchFile(file);
					}
				}
			} 
		]
	]
};
