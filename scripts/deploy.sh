./build-and-branch.sh
git push --set-upstream origin gh-pages -f
git add --a
git stash
git git checkout master
