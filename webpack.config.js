import { dirname, join } from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
    const isProduction = argv.mode === 'production';

    const entry = {
        // Используем вложенные пути для output
        index: './src/common/index.ts',
        'client/index': './src/client/index.ts',
        'server/index': './src/server/index.ts',
    };

    const baseConfig = {
        target: 'node22',
        entry,
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
            splitChunks: false, // Важно: отключаем для библиотек
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
                // Используем [name] для разных entry points
                filename: '[name].mjs',
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
                // Используем [name] для разных entry points
                filename: '[name].cjs',
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
