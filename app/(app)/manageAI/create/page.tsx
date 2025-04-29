"use client";
import { Box, Tabs } from "@radix-ui/themes";
import React, { Suspense, useEffect } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAgent from "../_hooks/useAgent";
import AdvanceSetting from "./_components/AdvanceSetting";
import BasicInfo from "./_components/BasicInfo";
import SocialMediaConfigForm from "./_components/GroupSetting";
import ModulesSettings from "./_components/ModulesSettings";

const CreateAgentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAgent />
    </Suspense>
  );
};

const CreateAgent = () => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      messageExamples: [
        {
          user: "",
          agent: "",
        },
      ],
      modules: {
        education: false,
        combat: false,
      },
    },
  });

  const { createAgent } = useAgent();
  const [loading, setLoading] = React.useState(false);

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

  useEffect(() => {
    const templateData = localStorage.getItem("agentTemplate");
    if (templateData) {
      const agent = JSON.parse(templateData);
      console.log(agent);
      const character = agent.templateAgent.character;

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
        setValue(style, character.style[style]),
      );

      const defaultSecrets = {
        DISCORD_APPLICATION_ID: "",
        DISCORD_API_TOKEN: "",
        DISCORD_VOICE_CHANNEL_ID: "",
        TELEGRAM_BOT_TOKEN: "",
        // ... add other default secret fields
      };

      setValue("secrets", defaultSecrets);

      setValue(
        "messageExamples",
        character.messageExamples.map((message: any) => ({
          user: message[0].content.text,
          agent: message[1].content.text,
        })),
      );

      localStorage.removeItem("agentTemplate");
    }
  }, [setValue]);

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

  const onSubmit = async (data: FieldValues) => {
    console.log("Form data before submission:", data);
    console.log("Modules data:", data.modules);

    if (data.clients.includes("discord")) {
      if (
        !data?.secrets?.DISCORD_APPLICATION_ID ||
        !data?.secrets?.DISCORD_API_TOKEN
      ) {
        toast.error(
          "Please fill in the Discord Application ID and Discord API Token",
        );
        return;
      }
    }
    const message = toast.loading("Creating AI Agent...");
    setLoading(true);

    // Extract modules data for use at both levels
    const modulesData = data.modules as { education: boolean };
    console.log("Extracted modules data for submission:", modulesData);

    const dataSubmit = {
      config: {
        clientConfig: {
          telegram: {
            shouldIgnoreBotMessages: true,
            shouldIgnoreDirectMessages: false,
            shouldRespondOnlyToMentions: false,
            shouldOnlyJoinInAllowedGroups: false,
            allowedGroupIds: [
              -1002250682364,
              -1002091042838,
              -1002118895236
            ],
            isPartOfTeam: false,
            teamAgentIds: [5900488737],
            teamLeaderId: 5900488737,
            teamMemberInterestKeywords: [] as [],
            enableGroupVoiceChat: false
          },
          discord: {
            shouldIgnoreBotMessages: true,
            shouldIgnoreDirectMessages: true,
            shouldRespondOnlyToMentions: true,
            isPartOfTeam: false,
            teamAgentIds: [5900488737],
            teamLeaderId: 5900488737,
            teamMemberInterestKeywords: [] as []
          }
        },
        name: data.name as string,
        plugins: [] as string[],
        adjectives: data.adjectives as string[],
        people: [] as string[],
        topics: data.topics as string[],
        style: {
          all: [...data.all] as string[],
          chat: [...data.chat] as string[],
          post: [...data.post] as string[],
        },
        system: data.system as string,
        knowledge: data.knowledge as string[],
        clients: data.clients as string[],
        modelProvider: data.modelProvider as string,
        bio: data.bio as string[],
        lore: data.lore as string[],
        postExamples: data.postExamples as string[],
        // Include modules within config
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
      },
      // Also include at root level for future compatibility
      modules: modulesData,
    };
    try {
      console.log("Submitting data with modules:", dataSubmit.modules);
      const response = await createAgent(dataSubmit);
      toast.dismiss(message);
      if (response.success) {
        toast.success("AI Agent created successfully");
      }
    } catch (error: any) {
      toast.error("Failed to create AI Agent", {
        id: message,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (value: boolean) => {
    console.log("Module value changed in create page:", value);
    // Note: The specific module being changed is now handled within the ModulesSettings component
    // No further actions needed here since the component manages localStorage
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs.Root defaultValue="basic">
          <Tabs.List>
            <Tabs.Trigger value="basic">Basic info</Tabs.Trigger>
            <Tabs.Trigger value="advance">Advance setting</Tabs.Trigger>
            <Tabs.Trigger value="modules">Modules</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="basic">
              <BasicInfo
                register={register}
                errors={errors}
                fieldArrays={fieldArrays}
                getValues={getValues}
                setValue={setValue}
              />
            </Tabs.Content>

            <Tabs.Content value="advance">
              <AdvanceSetting register={register} watch={watch} control={control} />
              <SocialMediaConfigForm register={register} watch={watch} control={control} />
            </Tabs.Content>

            <Tabs.Content value="modules">
              <ModulesSettings
                register={register}
                watch={watch}
                control={control}
                onModuleChange={handleModuleChange}
                setValue={setValue}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
        <div className="flex justify-end mt-4">
          <button
            disabled={loading}
            type="submit"
            className={`w-full ${loading ? "bg-orange-800" : "bg-orange-500"} text-white rounded-md py-2`}
          >
            Create AI Agent
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAgentPage;
