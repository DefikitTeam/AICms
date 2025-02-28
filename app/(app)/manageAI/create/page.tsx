"use client";
import { Box, Tabs } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAgent from "../_hooks/useAgent";
import AdvanceSetting from "./_components/AdvanceSetting";
import BasicInfo from "./_components/BasicInfo";

const CreateAgent = () => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      messageExamples: [
        {
          user: "",
          agent: "",
        },
      ],
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
    console.log(templateData);
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

      setValue("secrets", {
        ...defaultSecrets,
        ...character.settings.secrets,
      });

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
    const dataSubmit = {
      config: {
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
    };
    try {
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

  return (
    <div className="flex flex-col overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs.Root defaultValue="basic">
          <Tabs.List>
            <Tabs.Trigger value="basic">Basic info</Tabs.Trigger>
            <Tabs.Trigger value="advance">Advance setting</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="basic">
              <BasicInfo
                register={register}
                errors={errors}
                fieldArrays={fieldArrays}
                getValues={getValues}
              />
            </Tabs.Content>

            <Tabs.Content value="advance">
              <AdvanceSetting register={register} />
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

export default CreateAgent;
