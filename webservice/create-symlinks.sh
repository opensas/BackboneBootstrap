# remove symlinks

echo "removing public/minapp & public/demoapp folder"
rm -fr ./public/minapp
rm -fr ./public/demoapp

echo "creating symlinks to minapp & demoapp"

pushd public
ln -s ../../minapp ./minapp
ln -s ../../demoapp ./demoapp
popd
