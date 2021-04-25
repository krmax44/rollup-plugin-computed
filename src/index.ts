import { name } from '../package.json';
import type { Plugin as VitePlugin } from 'vite';
import { PluginContext } from 'rollup';
import { contentType as getContentType } from 'mime-types';
import Computer from './Computer';
import type { ComputerObj } from './Computer';

type ComputerFn = (this: PluginContext) => any | Promise<any>;

export type Computers = Record<string, ComputerFn | ComputerObj>;
interface Options {
	computers: Computers;
}

export default function computed(options: Options): VitePlugin {
	const computers = Object.keys(options.computers).reduce((obj, key) => {
		obj[key] = Computer.normalize(options.computers[key], key);
		return obj;
	}, <Record<string, Computer>>{});

	let isVite = false;
	let rollup: PluginContext;

	return {
		name,
		resolveId(source) {
			rollup = this;
			return source.endsWith('.computed') ? source : undefined;
		},
		async load(id) {
			rollup = this;
			const { watchMode } = this.meta;
			const [, name] = /(.*?)\.computed/.exec(id) ?? [];
			const computer = computers[name];
			if (!computer) return null;

			const type = computer.type ?? 'chunk';

			// save as file

			let data: any;
			if (type === 'asset') {
				if (!isVite) {
					const handle = await computer.emit(this);
					data = `import.meta.ROLLUP_FILE_URL_${handle}`;
				} else {
					data = `'/@computed/${name}'`;
				}

				return `export default ${data};`;
			} else if (computer.split && !watchMode) {
				computer.emit(this);
			}

			return computer.serialize(this);
		},
		buildStart() {
			if (isVite) return;

			for (const computer of Object.values(computers)) {
				if (computer.alwaysBuild && computer.type === 'asset') {
					computer.emit(this);
				}
			}
		},
		async configureServer(server) {
			isVite = true;

			server.middlewares.use(async (req, res, next) => {
				const [, name] = /\/@computed\/(.+)/.exec(req.url ?? '') ?? [];
				const computer = computers[name];

				if (name && computer) {
					const { fileExt } = computer;
					if (!fileExt)
						return console.error(`No fileExt specified for ${name}.`);

					const contentType = getContentType(fileExt);
					if (!contentType) return console.error(`Unknown fileExt ${fileExt}`);

					res.setHeader('Content-Type', contentType);
					res.end(await computer.get(rollup));
				} else {
					next();
				}
			});
		}
	};
}

export type { Computer, ComputerObj };
