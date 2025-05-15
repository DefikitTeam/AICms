#! /bin/bash

cd /root/projects/AICms

pnpm install

pnpm build

pnpm start -p 6000
