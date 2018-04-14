import {addPlugins, createConfig, defineConstants, entryPoint, env, setOutput, sourceMaps, match} from '@webpack-blocks/webpack';
import * as webpack from 'webpack';
import * as sass from '@webpack-blocks/sass';
import {css, file} from '@webpack-blocks/assets';
import * as postcss from '@webpack-blocks/postcss';
import * as uglify from '@webpack-blocks/uglify';
import * as devServer from '@webpack-blocks/dev-server';
import * as extractText from '@webpack-blocks/extract-text';
import * as typescript from '@webpack-blocks/typescript';
import * as autoprefixer from 'autoprefixer';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as path from 'path';

export default createConfig([
    entryPoint({
        main: './src/main.ts',
        styles: './src/css/styles.scss',
        fonts: './src/css/fonts.scss'
    }),
    env('development', [
        setOutput('./build/[name].js')
    ]),
    env('production', [
        setOutput('./build/[name].[chunkhash].js')
    ]),
    match('*.scss', { exclude: path.resolve('node_modules') }, [
        sass(),
        css(),
        postcss({
            plugins: [
                autoprefixer({ browsers: ['last 2 versions'] })
            ]
        }),
        env('development', [
            extractText('[name].css')
        ]),
        env('production', [
            extractText('[name].[contenthash].css')
        ])
    ]),
    match('*.ts', { exclude: path.resolve('node_modules') }, [
        typescript()
    ]),
    match(['*.woff', '*.woff2', '*.csv'], [
        file()
    ]),
    defineConstants({
        'process.env.NODE_ENV': process.env.NODE_ENV || 'development'
    }),
    addPlugins([
        new CleanWebpackPlugin('build')
    ]),
    env('development', [
        addPlugins([
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'templates/index.ejs')
            })
        ]),
        devServer({
            overlay: true,
            compress: true,
            watchContentBase: true,
            hot: false,
            hotOnly: false,
            contentBase: [path.join(__dirname, '/static/'), path.join(__dirname, '/build/')]
        }),
        sourceMaps()
    ]),
    env('production', [
        uglify(),
        addPlugins([
            new webpack.LoaderOptionsPlugin({ minimize: true })
        ])
    ])
]);