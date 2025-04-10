"use client";
import { PublishAgentButton } from "@defikitdotnet/public-agent-module/frontend";
import { usePrivy } from "@privy-io/react-auth";
import { Box, Spinner, Tabs } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAgent from "../../_hooks/useAgent";
import useTemplateAgent from "../../_hooks/useTemplateAgent";
import AdvanceSetting from "../../create/_components/AdvanceSetting";
import BasicInfo from "../../create/_components/BasicInfo";
import SocialMediaConfigForm from "../../create/_components/GroupSetting";
import ModulesSettings from "../../create/_components/ModulesSettings";

const UpdateAgent = () => {
  const [agent, setAgent] = React.useState<any>(null);
  const { getDetailAgent } = useAgent();
  const { agentId } = useParams();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingUpdate, setLoadingUpdate] = React.useState<boolean>(false);
  const { exportTemplateAgent } = useTemplateAgent();
  const { getAccessToken } = usePrivy();
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await getAccessToken();
      setToken(accessToken);
    };

    fetchToken();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      modules: {
        education: false,
      }
    }
  });

  const fetchAgent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDetailAgent(agentId as string);
      const { character } = response;
      setAgent(response);
      console.log("Fetched agent data:", response);
      console.log("Character modules:", character.modules);

      const fieldsToSet = [
        "name",
        "adjectives",
        "knowledge",
        "topics",
        "system",
        "clients",
        "modelProvider",
        "bio",
        "lore",
        "postExamples",
      ];

      fieldsToSet.forEach((field) => setValue(field, character[field]));

      ["all", "chat", "post"].forEach((style) =>
        setValue(style, character.style[style])
      );

      for (const [key, value] of Object.entries(character.settings.secrets)) {
        setValue(`secrets.${key}`, value);
      }

      // First set module values from server data
      if (character.modules) {
        console.log("Setting modules from server data:", character.modules);
        setValue("modules", character.modules);
      } else {
        console.log("No modules found in server data, using default");
      }

      setValue(
        "messageExamples",
        character.messageExamples.map((message: any) => ({
          user: message[0].content.text,
          agent: message[1].content.text,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch agent details", error);
      toast.error("Failed to fetch agent details");
    } finally {
      setLoading(false);
    }
  }, [agentId, getDetailAgent, setValue]);

  const exportTemplate = async () => {
    try {
      setLoadingUpdate(true);
      const message = toast.loading(
        agent?.isExportData
          ? "Removing from templates..."
          : "Adding to templates..."
      );

      const dataExportTemplateAgent = {
        agentId: agentId as string,
        isExportData: agent?.isExportData === 0 ? 1 : 0,
      };

      await exportTemplateAgent(dataExportTemplateAgent);
      setAgent((prev: any) => ({ ...prev, isExportData: !prev.isExportData }));

      toast.success(
        !agent?.isExportData ? "Export to templates" : "Unexpected templates",
        { id: message }
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update template status"
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  useEffect(() => {
    // After fetching agent data, check localStorage for agent-specific module settings
    // This will override server settings if present
    if (typeof window !== 'undefined' && agentId) {
      const savedStatus = localStorage.getItem(`educationModuleEnabled_${agentId}`);
      console.log(`Retrieved education module status for agent ${agentId} from localStorage:`, savedStatus);
      
      if (savedStatus !== null) {
        console.log(`Overriding server module settings with localStorage value: ${savedStatus}`);
        setValue('modules.education', savedStatus === 'true');
      } else {
        console.log('No localStorage module settings found, keeping server values');
      }
    }
  }, [setValue, agentId, loading]);
  
  const { updateAgent, toggleAgent } = useAgent();

  const topicsArray = useFieldArray({ control, name: "topics" });
  const knowledgeArray = useFieldArray({ control, name: "knowledge" });
  const adjectivesArray = useFieldArray({ control, name: "adjectives" });
  const allArray = useFieldArray({ control, name: "all" });
  const chatArray = useFieldArray({ control, name: "chat" });
  const postArray = useFieldArray({ control, name: "post" });
  const postExamplesArray = useFieldArray({ control, name: "postExamples" });
  const messageExamplesArray = useFieldArray({
    control,
    name: "messageExamples",
  });
  const bioArray = useFieldArray({ control, name: "bio" });
  const loreArray = useFieldArray({ control, name: "lore" });

  const fieldArrays = {
    topics: topicsArray,
    knowledge: knowledgeArray,
    adjectives: adjectivesArray,
    all: allArray,
    chat: chatArray,
    post: postArray,
    postExamples: postExamplesArray,
    messageExamples: messageExamplesArray,
    bio: bioArray,
    lore: loreArray,
  };

  const toggleAgentStatus = async () => {
    try {
      setLoadingUpdate(true);
      const response = await toggleAgent(agentId as string);
      if (response.success) {
        setAgent((prev: any) => ({ ...prev, isRunning: !prev.isRunning }));
      }
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to toggle agent status");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    console.log("Form data before updating:", data);
    console.log("Modules data:", data.modules);
    
    if (data.clients.includes("discord")) {
      if (
        !data?.secrets?.DISCORD_APPLICATION_ID ||
        !data?.secrets?.DISCORD_API_TOKEN
      ) {
        toast.error(
          "Please fill in the Discord Application ID and Discord API Token"
        );
        return;
      }
    }

    setLoadingUpdate(true);
    const message = toast.loading("Updating AI Agent...");
    
    // Extract modules data for use at both levels
    const modulesData = data.modules as { education: boolean };
    console.log("Extracted modules data for submission:", modulesData);
    
    // Save module settings to localStorage with agent-specific key
    if (typeof window !== 'undefined' && agentId) {
      localStorage.setItem(`educationModuleEnabled_${agentId}`, modulesData.education ? 'true' : 'false');
      console.log(`Saved education module status for agent ${agentId} to localStorage:`, modulesData.education);
    }
    
    const dataSubmit = {
      clientConfig: {
        telegram: {
          shouldIgnoreBotMessages: true,
          shouldIgnoreDirectMessages: false,
          shouldRespondOnlyToMentions: false,
          shouldOnlyJoinInAllowedGroups: false,
          allowedGroupIds: [-1002250682364, -1002091042838, -1002118895236],
          isPartOfTeam: false,
          teamAgentIds: [5900488737],
          teamLeaderId: 5900488737,
          teamMemberInterestKeywords: [] as [],
          enableGroupVoiceChat: false,
        },
        discord: {
          shouldIgnoreBotMessages: true,
          shouldIgnoreDirectMessages: true,
          shouldRespondOnlyToMentions: true,
          isPartOfTeam: false,
          teamAgentIds: [5900488737],
          teamLeaderId: 5900488737,
          teamMemberInterestKeywords: [] as [],
        },
      },
      name: data.name as string,
      plugins: [] as string[],
      adjectives: data.adjectives as string[],
      people: [] as string[],
      topics: data.topics as string[],
      style: {
        all: data.all as string[],
        chat: data.chat as string[],
        post: data.post as string[],
      },
      system: data.system as string,
      knowledge: data.knowledge as string[],
      clients: data.clients as string[],
      modelProvider: data.modelProvider as string,
      bio: data.bio as string[],
      lore: data.lore as string[],
      postExamples: data.postExamples as string[],
      // Include modules at root level for future compatibility
      modules: modulesData,
      settings: {
        secrets: {
          ...(data.secrets as Record<string, string>),
        },
        voice: {
          model: "en_US-hfc_female-medium",
        },
        imageSettings: {
          steps: 10,
          width: 512,
          height: 512,
        },
      },
      messageExamples: data.messageExamples.map((message: any) => [
        {
          user: "{{user1}}",
          content: {
            text: message.user,
          },
        },
        {
          user: data.name as string,
          content: {
            text: message.agent,
          },
        },
      ]),
    };
    
    try {
      console.log("Submitting data with modules:", dataSubmit.modules);
      const response = await updateAgent(agentId as string, dataSubmit);
      toast.dismiss(message);
      if (response.success) {
        toast.success("AI Agent updated successfully");
      }
      
      // Force refresh agent data to update the UI
      await fetchAgent();
    } catch (error: any) {
      if (error.response.data.message) {
        toast.error(error.response.data.message, {
          id: message,
        });
      } else {
        toast.error("Failed to update AI Agent", {
          id: message,
        });
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs.Root defaultValue="basic">
          <div className="relative">
            <Tabs.List>
              <Tabs.Trigger value="basic">Basic info</Tabs.Trigger>
              <Tabs.Trigger value="advance">Advance setting</Tabs.Trigger>
              <Tabs.Trigger value="modules">Modules</Tabs.Trigger>
            </Tabs.List>
            <div className="absolute flex gap-2 top-0 right-0">
              <button
                type="button"
                disabled={loadingUpdate}
                onClick={exportTemplate}
                className={`${
                  agent?.isExportData ? "bg-red-600" : "bg-blue-600"
                } text-white rounded-md py-1 px-2 flex items-center gap-1`}
              >
                {loadingUpdate && <Spinner size="1" />}
                {agent?.isExportData ? "Unexport Template" : "Export Template"}
              </button>
              <button
                disabled={loadingUpdate}
                type="button"
                onClick={toggleAgentStatus}
                className={`${!agent?.isRunning ? "bg-red-600" : "bg-green-600"} text-white rounded-md py-1 px-2 flex items-center gap-1`}
              >
                {loadingUpdate && <Spinner size="1" />}
                {agent?.isRunning ? "Running" : "Stopped"}
              </button>
              <PublishAgentButton
                agentId={agentId as string}
                accessToken={token as string}
                disabled={!agent?.isRunning}
              />
            </div>
          </div>

          <Box pt="3">
            <Tabs.Content value="basic">
              <BasicInfo
                getValues={getValues}
                register={register}
                errors={errors}
                fieldArrays={fieldArrays}
                setValue={setValue}
              />
            </Tabs.Content>

            <Tabs.Content value="advance">
              <AdvanceSetting
                register={register}
                watch={watch}
                control={control}
              />
              <SocialMediaConfigForm
                register={register}
                watch={watch}
                control={control}
              />
            </Tabs.Content>

            <Tabs.Content value="modules">
              <ModulesSettings 
                register={register} 
                watch={watch} 
                control={control} 
                setValue={setValue}
                agentId={agentId as string}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
        <div className="flex justify-end mt-4">
          <button
            disabled={loadingUpdate}
            type="submit"
            className={`w-full ${
              loadingUpdate ? "bg-orange-800" : "bg-orange-500"
            } text-white rounded-md py-2`}
          >
            Update AI Agent
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAgent;
