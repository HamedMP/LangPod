import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PodTab } from "./_tabs/PodTab";

function ConversationTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Conversation</h2>
      <p>Conversation content goes here</p>
    </div>
  );
}

function CoachTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Coach</h2>
      <p>Coach content goes here</p>
    </div>
  );
}

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
