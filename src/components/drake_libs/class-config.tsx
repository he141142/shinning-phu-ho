import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "@radix-ui/react-switch";
import { Button } from "react-day-picker";
import { ClassConfig } from "@/models/class/class.config";

interface ConfigComponentProps {
  configs: ClassConfig[];
  class_id: number;
}

export interface ConfigSectionRef {
  getUpdatedConfigs: () => ClassConfig[];
}

export const ConfigSection = forwardRef<ConfigSectionRef, ConfigComponentProps>(
  ({ configs, class_id }, ref) => {
    const [localConfigs, setLocalConfigs] = useState<ClassConfig[]>(configs);

    const handleConfigChange = (config_id: number, isEnable: boolean) => {
      setLocalConfigs((prevConfigs) =>
        prevConfigs.map((config) =>
          config.config_id === config_id ? { ...config, is_enable: isEnable } : config
        )
      );
    };

    // Expose methods or values to the parent via ref
    useImperativeHandle(ref, () => ({
      getUpdatedConfigs: () => localConfigs,
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle>Class Configuration</CardTitle>
          <CardDescription>Manage settings for this class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {localConfigs.map((configItem) => (
              <div key={configItem.config_id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor={`config-${configItem.config_id}`}>{configItem.name}</label>
                  <p className="text-sm text-muted-foreground">{configItem.description}</p>
                </div>
                <Switch
                  id={`config-${configItem.config_id}`}
                  checked={configItem.is_enable}
                  onCheckedChange={(isEnable) => handleConfigChange(configItem.config_id, isEnable)}
                />
              </div>
            ))}
          </div>
          <Button className="mt-6">Save Configuration</Button>
        </CardContent>
      </Card>
    );
  }
);

ConfigSection.displayName = "ConfigSection";
