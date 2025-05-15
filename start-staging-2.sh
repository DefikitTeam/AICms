#! /bin/bash

cd /root/projects/AICms-staging-2

pnpm install

pnpm build

pnpm start -p 3502
