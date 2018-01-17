const {
  readdirSync,
  writeFileSync,
  statSync,
  readFileSync,
  existsSync,
} = require('fs');

const LICENSE = readFileSync(__dirname + '/LICENSE.md');

const tsconfigBuild = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  }
}`;
const tsconfig = `{
  "extends": "../../tsconfig.json"
}`;

const dependencies = require('./package.json').devDependencies;
readdirSync(__dirname + '/packages').forEach(directory => {
  if (!statSync(__dirname + '/packages/' + directory).isDirectory()) {
    return;
  }
  writeFileSync(__dirname + '/packages/' + directory + '/LICENSE.md', LICENSE);
  writeFileSync(
    __dirname + '/packages/' + directory + '/tsconfig.json',
    tsconfig,
  );
  writeFileSync(
    __dirname + '/packages/' + directory + '/tsconfig.build.json',
    tsconfigBuild,
  );
});
