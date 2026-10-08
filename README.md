# Nero-apk
#Local Project Setup & Build Verification Instructions
​Building the Web Assets

#cd web
npm install
npm run build

#Copying Built Assets into Android Project
#mkdir -p android/app/src/main/assets/www
cp -r web/dist/* android/app/src/main/assets/www/

#Compiling the Native Android APK
#cd android
./gradlew assembleDebug

#The output debug APK will be generated at android/app/build/outputs/apk/debug/app-debug.apk.
