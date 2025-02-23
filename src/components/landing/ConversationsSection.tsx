import { Sparkles } from "lucide-react";

const features = [
  "Realistic conversation scenarios",
  "Natural language processing",
  "Adaptive difficulty levels",
  "Real-time pronunciation feedback",
];

const ConversationsSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Learn Through
              <span className="text-gradient"> Natural Conversations</span>
            </h2>
            <p className="text-lg text-gray-600">
              Practice with AI language partners that adapt to your level and
              learning style. Get instant feedback and improve your speaking
              skills naturally.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-1 rounded-full bg-primary/10">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="relative animate-in"
            style={{ animationDelay: "200ms" }}
          >
            <img
              src="/readme.jpg"
              alt="Natural Language Learning"
              className="rounded-2xl shadow-2xl hover-scale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversationsSection;
