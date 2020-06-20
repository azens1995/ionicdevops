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
    const platformPath = path.join(cordova.findProjectRoot(), 'platforms', platform);
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
        await execSync(`ionic cordova build ${platform} --release --configuration=${env} --verbose`,  {stdio: 'inherit'});
    }else {
        await execSync(`ionic cordova build ${platform} --configuration=${env} --verbose`)
    }
    
    console.log(`Sucessfully finished build for ${platform} :)`);
}

