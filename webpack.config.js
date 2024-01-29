const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js', // Adjust this to your actual entry file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Adjust this to your actual output path
    },
    stats: {
        children: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true, // Минимизация HTML (по желанию)
                        },
                    },
                ],
            },
            // Обработка JavaScript с использованием Babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // Обработка стилей
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // Обработка изображений
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // path to your HTML template
            filename: 'index.html', // output HTML file
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        hot: true,
    },
};