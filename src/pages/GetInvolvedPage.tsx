'use client';

import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { HandHeart, DollarSign, Handshake, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useState } from 'react';

const engagementCards = [
  {
    icon: HandHeart,
    title: 'Volunteer',
    description: 'Volunteer with SparkPoint in ways that fit your schedule and strengths — from events and outreach to behind-the-scenes support. We’ll match you with opportunities that help strengthen connection across our community.',
    benefits: [
      'Event support (check-in, set-up, hospitality)',
      'Community outreach & ambassador roles',
      'Program support (wellness, connection, food access)',
      'Behind-the-scenes help (admin, prep, organizing)'
    ],
    cta: 'Explore Opportunities',
    color: '#E03694',
    image: 'https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGVscGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjExMzg3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: DollarSign,
    title: 'Donate',
    description: 'Your financial support directly funds programs that strengthen our community. Every contribution makes a meaningful difference.',
    benefits: [
      'Tax-deductible giving',
      'One-time or recurring options',
      'Transparent impact reporting',
      '100% goes to programs'
    ],
    cta: 'Make a Donation',
    color: '#9E509F',
    image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGNoYXJpdHklMjBnaXZpbmd8ZW58MXx8fHwxNzYxMTM4NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    icon: Handshake,
    title: 'Partner With Us',
    description: 'Organizations, businesses, and agencies can amplify their impact through strategic partnership with SparkPoint.',
    benefits: [
      'Collaborative project opportunities',
      'Shared resources and expertise',
      'Community visibility',
      'Measurable social impact'
    ],
    cta: 'Start a Partnership',
    color: '#FDB515',
    image: 'https://images.unsplash.com/photo-1758599543157-bc1a94fec33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2MTEwMjc2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function GetInvolvedPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock subscription
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen relative">
      <Helmet>
        <title>Get Involved | SparkPoint</title>
        <meta name="description" content="Ways to connect, participate, and collaborate with SparkPoint." />
        <link rel="canonical" href="https://chfxpro.github.io/sparkpointv15/get-involved" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1687360440648-ec9708d52086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBkaXZlcnNpdHklMjBwZW9wbGV8ZW58MXx8fHwxNzYxMTM4NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(224, 54, 148, 0.9) 0%, rgba(158, 80, 159, 0.9) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
          >
            <h1
              className="mb-6"
              style={{ 
                color: 'white', 
                fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
                lineHeight: '1.1', 
                letterSpacing: '-2px' 
              }}
            >
              Be Part of the Spark
            </h1>
            <p
              className="max-w-3xl mx-auto"
              style={{ 
                color: 'rgba(255, 255, 255, 0.95)', 
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', 
                lineHeight: '1.6' 
              }}
            >
              Whether you give your time, resources, or expertise — every contribution 
              helps build a stronger, more connected community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Engagement Cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {engagementCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card 
                    className="h-full overflow-hidden transition-all hover:shadow-2xl"
                    style={{ background: 'white', border: `2px solid ${card.color}20` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, transparent 0%, ${card.color}90 100%)` }}
                      />
                      <div 
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'white' }}
                      >
                        <Icon size={24} style={{ color: card.color }} />
                      </div>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                      <h3
                        className="mb-3"
                        style={{ color: '#1A1A1A', fontSize: '1.75rem' }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="mb-6"
                        style={{ color: '#666666', fontSize: '1rem', lineHeight: '1.6', minHeight: '5.2em' }}
                      >
                        {card.description}
                      </p>
                      <div className="space-y-2 mb-6 flex-1">
                        {card.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-start gap-2">
                            <CheckCircle size={18} style={{ color: card.color, flexShrink: 0, marginTop: 2 }} />
                            <p style={{ color: '#666666', fontSize: '0.875rem' }}>
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-auto transition-all hover:brightness-110 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)`,
                          color: 'white',
                          boxShadow: `0 4px 12px ${card.color}40`
                        }}
                        onClick={() => {
                          if (card.title === 'Donate') {
                            window.location.href = 'https://www.yoursparkpoint.org/donations';
                          } else if (card.title === 'Volunteer') {
                            navigate('/intake?intent=volunteer');
                          } else if (card.title === 'Partner With Us') {
                            navigate('/intake?intent=partner');
                          }
                        }}
                      >
                        {card.cta}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1694350461777-1519e03ef70a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjA5OTcyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt=""
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{ background: 'rgba(224, 54, 148, 0.92)' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Mail size={48} style={{ color: 'white', margin: '0 auto 24px' }} />
            <h2
              className="mb-6"
              style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.2' }}
            >
              Stay Connected
            </h2>
            <p
              className="mb-8"
              style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.6' }}
            >
              Join our newsletter for updates on programs, events, stories, and opportunities to get involved.
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-4"
              >
                <CheckCircle size={24} style={{ color: 'white' }} />
                <p style={{ color: 'white', fontSize: '1.125rem', fontWeight: '700' }}>
                  Thanks for subscribing!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-6 text-lg"
                  style={{
                    background: 'white',
                    border: 'none',
                  }}
                />
                <Button
                  type="submit"
                  className="px-8 py-6 whitespace-nowrap transition-all hover:brightness-110 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #9E509F, #FDB515)',
                    color: 'white',
                    fontSize: '1.125rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Subscribe
                </Button>
              </form>
            )}

            <p
              className="mt-4"
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}
            >
              We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <blockquote
              className="mb-6"
              style={{ 
                color: '#1A1A1A', 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}
            >
              "Alone we can do so little; together we can do so much."
            </blockquote>
            <p style={{ color: '#666666', fontSize: '1.125rem' }}>
              — Helen Keller
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
