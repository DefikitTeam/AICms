"use client";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@radix-ui/themes";
import toast from "react-hot-toast";
import useTemplateAgent from "@/app/(app)/manageAI/_hooks/useTemplateAgent";

interface Template {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isExportData: boolean;
}

const TemplatesPage = () => {
  const [agentTemplates, setAgentTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { getListTemplate, getTemplateAgent } = useTemplateAgent();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getListTemplate();
        setAgentTemplates(data.templateAgents);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch templates");
      }
    };
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
  }

  const importTemplate = async (agentTemplateid: string) => {
    try {
      const message = toast.loading("Loading template...");
      const template = await getTemplateAgent(agentTemplateid);
      console.log("template", template);
      if (!template) {
        toast.error("Template not found", { id: message });
        return;
      }

      localStorage.setItem("agentTemplate", JSON.stringify(template));
      window.location.href = "/manageAI/create";
      toast.success("Template loaded successfully", { id: message });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load template");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="3" />
      </div>
    );
  }

  if (agentTemplates.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No templates available yet. Export an agent as template to get started.
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-3xl font-medium text-brand-600 text-center">
        Agent Templates
      </p>
      <p className="text-center text-lg text-neutral-500 dark:text-neutral-400 mt-2">
        Use pre-configured templates to create new agents quickly
      </p>

      <div className="mt-6 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agentTemplates.map((agentTemplate) => (
          <div
            key={agentTemplate.id}
            className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
          >
            <h3 className="text-xl font-semibold mb-2">{agentTemplate.name}</h3>
            {agentTemplate.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {agentTemplate.description}
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Created:{" "}
                {new Date(agentTemplate.createdAt).toLocaleDateString()}
              </span>
              <Button
                onClick={() => importTemplate(agentTemplate.id)}
                color="orange"
                variant="solid"
                radius="large"
              >
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>

      {agentTemplates.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          No templates available yet. Export an agent as template to get
          started.
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
