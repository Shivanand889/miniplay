import React, { useState } from 'react';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      const subjectLine = subject
        ? encodeURIComponent(subject)
        : encodeURIComponent('MiniPlay Contact Form');
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:contact@playhere.space?subject=${subjectLine}&body=${body}`;
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead
        title="Contact Us"
        description="Get in touch with the MiniPlay team. Send feedback, report a gameplay bug, or ask questions."
        canonicalUrl="https://www.playhere.space/contact"
      />

      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Support &amp; Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Contact MiniPlay
        </h1>
        <p className="text-base text-text-muted mt-2">
          Have an idea for a new arcade game, found a glitch, or want to partner with us? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to the MiniPlay arcade team. We review all community feedback and will reply within 48 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow-primary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Player One"
                  className="w-full rounded-xl bg-dark-bg border border-dark-border px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full rounded-xl bg-dark-bg border border-dark-border px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Gameplay Feedback / Bug Report / General"
                  className="w-full rounded-xl bg-dark-bg border border-dark-border px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message, high-score story, or feedback here..."
                  className="w-full rounded-xl bg-dark-bg border border-dark-border px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-3 px-4 text-sm font-bold shadow-glow-primary transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Operational & Owner Placeholders */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-dark-border bg-dark-card/40 p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" />
              <span>Direct Inquiries</span>
            </h3>

            <div className="space-y-3 text-xs text-text-muted">
              <div>
                <span className="font-semibold text-text-main block">Official Support Email:</span>
                <a
                  href="mailto:contact@playhere.space"
                  className="font-mono text-secondary hover:underline"
                >
                  contact@playhere.space
                </a>
              </div>

              <div className="pt-2 border-t border-dark-border">
                <span className="font-semibold text-text-main block">Response Window:</span>
                <span>Typically 24 - 48 business hours</span>
              </div>

              <div className="pt-2 border-t border-dark-border">
                <span className="font-semibold text-text-main block">Bug Reports:</span>
                <span>Please mention your browser (Chrome/Safari) and operating system (Mac/iOS/Android/Windows).</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
