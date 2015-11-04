#!/usr/bin/env bash
cd /tmp
wget http://sourceforge.net/projects/open-cobol/files/gnu-cobol/1.1/gnu-cobol-1.1.tar.gz/download -O gnucobol.tar.gz
tar -xzf gnucobol.tar.gz
cd gnu-cobol-1.1/
./configure
make
sudo ldconfig
sudo make install