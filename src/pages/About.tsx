import { motion } from "framer-motion";
import { Users, Target, Zap, Shield, Mail } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-gradient">ToolSuiteX</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Empowering professionals with browser-based tools that respect your privacy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At ToolSuiteX, we believe that powerful productivity tools should be accessible to everyone, 
                without compromising on privacy or requiring expensive subscriptions. Our mission is to 
                provide a comprehensive suite of browser-based tools that run entirely on your device.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every tool in our collection is designed with three core principles: 
                <span className="text-primary font-medium"> privacy-first processing</span>, 
                <span className="text-primary font-medium"> instant performance</span>, and 
                <span className="text-primary font-medium"> intuitive usability</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your data never leaves your browser. We don't track, store, or process your information on any server."
              },
              {
                icon: Zap,
                title: "Performance",
                description: "Built with modern web technologies for instant results. No waiting for server responses."
              },
              {
                icon: Users,
                title: "Accessibility",
                description: "Free for everyone. No accounts required. Works on any device with a modern browser."
              },
              {
                icon: Target,
                title: "Quality",
                description: "Every tool is crafted to be the best in its category, with intuitive interfaces and powerful features."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Our Technology</h2>
              <div className="glass-card p-8">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  ToolSuiteX leverages cutting-edge web technologies including WebAssembly, 
                  the Canvas API, Web Workers, and modern JavaScript to deliver desktop-class 
                  performance right in your browser.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {["React", "TypeScript", "WebAssembly", "Canvas API"].map((tech) => (
                    <div key={tech} className="p-4 rounded-lg bg-muted/50">
                      <span className="font-medium">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you.
            </p>
            <a
              href="mailto:sctv77834@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              sctv77834@gmail.com
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
