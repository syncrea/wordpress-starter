import * as copy from 'copy';
import * as replace from 'replace-in-file';
import * as path from 'path';
import * as rimraf from 'rimraf';

const sourceGlobs = [
    path.join(__dirname, 'build/styles*.css'),
    path.join(__dirname, 'build/fonts*.css'),
    path.join(__dirname, 'build/main*.js'),
    path.join(__dirname, 'build/*.{woff,woff2}')
];
const targetFolder = path.join(__dirname, '../docker/wp_data/wp-content/themes/website/assets');
const htmlFilePath = path.join(__dirname, '../docker/wp_data/wp-content/themes/website/views/base.twig');

const fileNamePatterns = [
    /styles\..+\.css/g,
    /fonts\..+\.css/g,
    /main\..+\.js/g
];

rimraf(targetFolder, () => {
    copy(sourceGlobs, targetFolder, (err, files) => {
        if (err) throw err;

        const replaceOptions = files.map(file => {
            return {
                fileName: path.basename(file.path),
                matchingPattern: fileNamePatterns
                    .find((pattern) => pattern.test(path.basename(file.path)))
            };
        }).filter((match) => match.matchingPattern).reduce((replaceOptions, match) => {
            return {
                from: [...replaceOptions.from, match.matchingPattern],
                to: [...replaceOptions.to, match.fileName]
            };
        }, {from: [], to: []});

        replace({
            files: htmlFilePath,
            ...replaceOptions
        }, (err) => {
            if (err) throw err;
            console.log('Integration completed:');
            console.log(replaceOptions);
        });
    });
});
