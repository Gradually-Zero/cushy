#!/usr/bin/env bash

find . -type d -name "node_modules" -exec rm -rf {} \;
find . -type d -name "lib" -exec rm -rf {} \;
find . -type d -name ".cushy" -exec rm -rf {} \;
