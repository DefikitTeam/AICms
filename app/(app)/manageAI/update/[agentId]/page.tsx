"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, FieldValues } from "react-hook-form";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import useAgent from "../../_hooks/useAgent";
import BasicInfo from "./_components/BasicInfo";
import AdvanceSetting from "./_components/AdvanceSetting";
import { Box, Tabs } from "@radix-ui/themes";
import { fieldConfigs } from "@/app/(app)/manageAI/update/[agentId]/data/utils";

const UpdateAgent = () => {
  const params = useParams();
  const agentId = params.agentId;
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState<any>(null);

  const {
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

  const { updateAgent, getAgent } = useAgent();

  const fieldArrays = fieldConfigs.reduce(
    (acc, field) => {
      console.log(field);
      acc[field.name] = useFieldArray({
        control,
        name: field.name,
      });
      return acc;
    },
    {} as Record<string, ReturnType<typeof useFieldArray>>,
  );

  useEffect(() => {
    let mounted = true;

    const fetchAgent = async () => {
      if (!agentId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAgent(agentId as string);
        if (!mounted) return;

        if (data) {
          setAgentData(data);
          // Set basic information
          setValue("name", data.character.name);
          setValue("modelProvider", data.character.modelProvider);
          setValue("system", data.character.system);
          setValue("clients", data.character.clients);

          // Set arrays
          setValue("adjectives", data.character.adjectives);
          setValue("topics", data.character.topics);
          setValue("people", data.character.people);

          // Set style settings
          setValue("all", data.character.style.all);
          setValue("chat", data.character.style.chat);
          setValue("post", data.character.style.post);

          // Set bio and lore
          setValue("bio", data.character.bio);
          setValue("lore", data.character.lore);

          // Set examples
          setValue("postExamples", data.character.postExamples);
          
          // Set message examples
          const formattedMessageExamples = data.character.messageExamples.map(
            (example: any[]) => ({
              user: example[0].content.text,
              agent: example[1].content.text,
            })
          );
          setValue("messageExamples", formattedMessageExamples);

          // Clear and append field arrays
          fieldConfigs.forEach((field) => {
            if (!mounted) return;
            // Clear existing fields
            while (fieldArrays[field.name].fields.length !== 0) {
              fieldArrays[field.name].remove(0);
            }
            // Append new data if it exists
            if (data.character[field.name]) {
              const fieldData = Array.isArray(data.character[field.name])
                ? data.character[field.name]
                : [data.character[field.name]];
              fieldData.forEach((item: any) => {
                fieldArrays[field.name].append(item);
              });
            }
          });
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching agent:', error);
        toast.error('Failed to load agent data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAgent();

    return () => {
      mounted = false;
    };
  }, [agentId, getAgent, setValue, fieldArrays]);

  const onSubmit = async (data: FieldValues) => {
    const message = toast.loading("Updating AI Agent...");
    const dataSubmit = {
      config: {
        name: data.name as string,
        plugins: [] as string[],
        adjectives: [...data.adjectives] as string[],
        people: [] as string[],
        topics: [...data.topics] as string[],
        style: {
          all: [...data.all] as string[],
          chat: [...data.chat] as string[],
          post: [...data.post] as string[],
        },
        system: data.system as string,
        clients: [...data.clients] as string[],
        modelProvider: data.modelProvider as string,
        bio: data.bio as string[],
        lore: data.lore as string[],
        postExamples: [...data.postExamples] as string[],
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
      const response = await updateAgent(dataSubmit, agentId as string);
      toast.dismiss(message);
      console.log(response);
      if (response.success) {
        toast.success("AI Agent updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update AI Agent", {
        id: message,
      });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Failed to load agent data</div>
      </div>
    );
  }

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
                setValue={setValue}
                getValues={getValues}
                agentData={agentData}
              />
            </Tabs.Content>
            <Tabs.Content value="advance">
              <AdvanceSetting register={register} />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-md py-2"
          >
            Update AI Agent
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAgent;
