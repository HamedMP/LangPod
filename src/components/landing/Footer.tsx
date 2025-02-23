
const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-gray-200 animate-in">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-2xl font-bold text-gradient">
            LangPod
          </div>
          <p className="text-gray-600 max-w-md">
            Master any language with AI-powered conversations and personalized learning.
          </p>
          <div className="mt-8 text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} LangPod. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
