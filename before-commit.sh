# remove symlinks

echo "removing src & lib symlink"
rm -fr ./demoapp/js/src
rm -fr ./demoapp/js/lib

echo "copying minapp directories"
cp -r ./minapp/js/src ./demoapp/js/src
cp -r ./minapp/js/lib ./demoapp/js/lib
