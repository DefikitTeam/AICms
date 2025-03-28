'use client'
import Providers from "@/app/_contexts";
import { AgentList} from "@defikitdotnet/public-agent-module/frontend"
export default function PublicAgent() {
  return <Providers><AgentList /></Providers>;
}
