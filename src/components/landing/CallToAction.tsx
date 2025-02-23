
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 relative z-10">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-8 animate-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-float">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Start Your Journey Today</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to Transform Your
            <span className="text-gradient"> Language Learning</span> Journey?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing the future of language learning with AI-powered conversations.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Button 
              size="lg"
              className="text-lg px-8 hover-lift bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
