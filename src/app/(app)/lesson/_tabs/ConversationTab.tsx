import { Conversation } from "@/components/conversation";
import { Card } from "@/components/ui/card";

export const ConversationTab = () => {
  return (
    <div className="space-y-4">
      <Card className="py-16">
        <Conversation />
      </Card>
    </div>
  );
};
