# remove symlinks

echo "removing src & lib copied folder"
rm -fr ./demoapp/js/src
rm -fr ./demoapp/js/lib

echo "creating symlinks to minapp"
pushd demoapp/js
ln -s ../../minapp/js/src ./src
ln -s ../../minapp/js/lib ./lib
popd
