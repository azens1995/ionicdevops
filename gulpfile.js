const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const { cordova } = require('cordova-lib');
const { execSync } = require('child_process');

gulp.task('prod-android', async function() {
    await addRemovePlatform('android');
    return setTimeout(async function () {
        await build('android', 'prod', true);
        await sign ('prod');
        await align('prod');
        return;
    }, 5000);
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
        await execSync(`ionic cordova build ${platform} --release --verbose`,  {stdio: 'inherit'});
    }else {
        await execSync(`ionic cordova build ${platform} --verbose`)
    }
    console.log('Sample release');
    
    console.log(`Sucessfully finished build for ${platform} :)`);
}

// apk signing for android
async function sign(env){
    console.log('Start apk signing....');
    if(env != 'uat'){
        await execSync('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore sampleapp.keystore  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk -storepass sample sampleapp', {stdio: 'inherit'});
    }else {
        await execSync('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore sampleapp.keystore  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk -storepass sample sampleapp', {stdio: 'inherit'});
    }
    
    console.log('Finsihed signing apk....')
}

// zip-align for android
async function align(env){
    
    console.log('Finding build-tool version...')
    const buildToolVersionString = execSync('ls $ANDROID_HOME/build-tools/',  { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }).toString();
    
    if(!buildToolVersionString){
        console.error('Could not find android sdk :\'(');
    }
    
    const buildToolVersions = buildToolVersionString.split('\n');
    console.log(`The list of build tools versions are `);
    console.log(buildToolVersions);
    buildToolVersions.map(version => console.log(`The build tools version is -> ${version}`));
    const buildToolVersionToUse = buildToolVersions[0];
    
    console.log(`Using android sdk version ${buildToolVersionToUse}...`);
    const androidHomePath = execSync('echo $ANDROID_HOME',  {encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }).toString().split('\n')[0];
    
    console.log(`Check if tribute-${env}.apk already exists...`);
    
    const exists = fs.existsSync(`./tribute-${env}.apk`);
    
    if(exists){
        console.log(`tribute-${env}.apk already exists, delete it`);
        await fs.unlinkSync(`tribute-${env}.apk`);
        console.log(`Finished deleting tribute-${env}.apk`);
    }
    console.log('Start zip align...')
    await execSync(`${androidHomePath}/build-tools/${buildToolVersionToUse}/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk tribute-${env}.apk`, {stdio: 'inherit'})
    
    console.log('Finished zipalign...')
}
