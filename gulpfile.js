const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const { cordova } = require('cordova-lib');
const { execSync } = require('child_process');

gulp.task('prod-android', async function() {
    await addRemovePlatform('android');
    await build('android', 'prod');
});

async function addRemovePlatform(platform) {
    console.log(`Check if ${platform} platform already exists.....`);
    console.log(cordova.findProjectRoot());
    console.log(`The project root is ${cordova.findProjectRoot()}`);
    const platformPath = path.join(cordova.findProjectRoot(), 'platforms', platform);
    console.log(`The file path created is ${platformPath}`);
    const exists = fs.existsSync(platformPath);
    if(exists){
        console.log(`${platform} platform already exists, remove ${platform} platfrom....`);
        await cordova.platform('remove', platform);
        console.log(`${platform} platform successfully removed....`);
    }
    
    console.log(`Add ${platform} platform with the new config.xml...`);
    await cordova.platform('add', platform);
    console.log(`Add ${platform} platform with the new config.xml successfully added....`);

}

async function build(platform, env, isRelease = true){
    console.log(`Start build for ${platform}......`);
    if(isRelease){
        await execSync(`ionic cordova build ${platform} --release --verbose`,  {stdio: 'inherit'});
    }else {
        await execSync(`ionic cordova build ${platform} --verbose`)
    }
    console.log('Sample release');
    
    console.log(`Sucessfully finished build for ${platform} :)`);
}

