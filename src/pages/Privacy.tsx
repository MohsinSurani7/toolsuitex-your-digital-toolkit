import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { usePageSEO } from "@/hooks/use-page-seo";

export default function Privacy() {
  usePageSEO({
    title: "Privacy Policy - ToolSuiteX",
    description: "ToolSuiteX privacy policy. Your data never leaves your browser. 100% client-side processing with no data collection.",
    canonical: "https://toolsuitex.online/privacy",
  });
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: February 6, 2025</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to ToolSuiteX. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy explains how we handle your information when you use our tools and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">We prioritize your privacy.</strong> Most of our tools operate entirely in your browser, 
                  meaning your data never leaves your device. Here's what we collect:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong className="text-foreground">No personal data collection:</strong> We don't require sign-ups or accounts.</li>
                  <li><strong className="text-foreground">No file uploads to servers:</strong> Images, documents, and files are processed locally in your browser.</li>
                  <li><strong className="text-foreground">Analytics:</strong> We may collect anonymous usage statistics to improve our services.</li>
                  <li><strong className="text-foreground">Local Storage:</strong> Some tools save preferences locally on your device for convenience.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Since we don't collect personal data, there's nothing to misuse. Any data processed by our tools 
                  remains on your device and is never transmitted to our servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use minimal cookies for essential functionality like remembering your theme preference (dark/light mode). 
                  We do not use tracking cookies or sell data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some tools may use third-party libraries for functionality (like PDF generation). 
                  These libraries operate locally in your browser and do not transmit your data externally.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your security is our priority. All tools use client-side processing, meaning sensitive data 
                  like passwords, documents, and images never leave your browser. For tools like Shadow Chat, 
                  we use peer-to-peer encryption with no server involvement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Since we don't store your personal data, there's nothing to delete or export. 
                  You have complete control over any data stored locally in your browser, which you can 
                  clear at any time through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:sctv77834@gmail.com" className="text-primary hover:underline">
                    sctv77834@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
