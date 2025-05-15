#! /bin/bash

cd /root/projects/AICms-staging

pnpm install

pnpm build

pnpm start -p 6001
