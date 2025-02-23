"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PodTab } from "./_tabs/PodTab";
import { ConversationTab } from "./_tabs/ConversationTab";
import { CoachTab } from "./_tabs/CoachTab";

export default function Page() {
  return (
    <div className="flex w-full">
      <Tabs defaultValue="pod" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pod">Pod</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="coach">Coach</TabsTrigger>
        </TabsList>
        <TabsContent value="pod">
          <PodTab />
        </TabsContent>
        <TabsContent value="conversation">
          <ConversationTab />
        </TabsContent>
        <TabsContent value="coach">
          <CoachTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
