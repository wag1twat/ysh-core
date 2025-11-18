import { dirname, join } from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
    const isProduction = argv.mode === 'production';

    const baseConfig = {
        target: 'node22',
        entry: './src/index.ts',
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: './tsconfig.json',
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: 'tsconfig.json',
                                transpileOnly: true,
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        externals: [
            nodeExternals({
                additionalModuleDirs: [join(__dirname, '../../node_modules')],
            }),
        ],
        optimization: {
            usedExports: true,
            sideEffects: false,
            minimize: isProduction,
            concatenateModules: isProduction,
            mangleExports: isProduction ? 'size' : false,
            innerGraph: true,
            providedExports: true,
            splitChunks: false,
            removeAvailableModules: isProduction,
            removeEmptyChunks: isProduction,
        },
        experiments: {
            topLevelAwait: true,
        },
    };

    const configs = [
        {
            ...baseConfig,
            name: 'esm',
            output: {
                path: join(__dirname, 'dist/esm'),
                filename: 'index.mjs',
                library: {
                    type: 'module',
                },
                module: true,
                environment: {
                    module: true,
                },
                clean: true,
            },
            experiments: {
                ...baseConfig.experiments,
                outputModule: true,
            },
            optimization: {
                ...baseConfig.optimization,
                sideEffects: 'flag',
            },
        },
        {
            ...baseConfig,
            name: 'cjs',
            output: {
                path: join(__dirname, 'dist/cjs'),
                filename: 'index.cjs',
                library: {
                    type: 'commonjs2',
                },
                clean: false,
            },
        },
    ];

    if (!isProduction) {
        configs.forEach((config) => {
            config.devtool = 'inline-source-map';
            config.optimization.minimize = false;
        });
    }

    return configs;
};
