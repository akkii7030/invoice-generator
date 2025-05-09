"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Check,
  ChevronUp,
  CreditCard,
  Download,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Star,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, PresentationControls } from "@react-three/drei"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { cn } from "../lib/utils"
import { useToast } from "../hooks/use-toast"

// Magnetic Button component
function MagneticButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }

    const x = (clientX - left - width / 2) * 0.2
    const y = (clientY - top - height / 2) * 0.2

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn("relative overflow-hidden rounded-full", className)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  )
}

// Testimonial Card component
function TestimonialCard({
  name,
  role,
  content,
  rating,
}: { name: string; role: string; content: string; rating: number }) {
  return (
    <motion.div
      className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-[0_0_15px_rgba(149,128,255,0.2)]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-purple-500 text-purple-500" />
        ))}
      </div>
      <p className="text-gray-300 mb-4">{content}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Function to generate and download PDF
async function generateInvoicePDF(invoiceRef: React.RefObject<HTMLDivElement | null>, clientName: string) {
  if (!invoiceRef.current) return

  try {
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#111111",
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save(`invoice-${clientName.replace(/\s+/g, "-").toLowerCase()}.pdf`)

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    return false
  }
}

// Feature Card component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-[0_0_15px_rgba(149,128,255,0.2)]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

// Pricing Card component
function PricingCard({
  title,
  price,
  description,
  features,
  highlighted,
}: {
  title: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <motion.div
      className={cn(
        "bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-[0_0_15px_rgba(149,128,255,0.2)]",
        "bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-[0_0_15px_rgba(149,128,255,0.2)]",
        highlighted && "border-purple-500 shadow-[0_0_30px_rgba(149,128,255,0.4)]",
      )}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <div className="text-4xl font-bold mb-4">{price}</div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-400">
            <Check className="w-4 h-4 text-purple-500" />
            {feature}
          </li>
        ))}
      </ul>
      <MagneticButton className="w-full">
        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
          Get Started
        </Button>
      </MagneticButton>
    </motion.div>
  )
}

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const { toast } = useToast()
  const invoiceRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    clientName: "Acme Inc.",
    clientEmail: "client@example.com",
    clientAddress: "123 Business St.",
    amount: "$1,250.00",
    dueDate: "May 15, 2025",
    invoiceNumber: "INV-2025-001",
    items: [
      { description: "Website Design", amount: "$750.00" },
      { description: "SEO Optimization", amount: "$500.00" },
    ],
  })

  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      content:
        "This invoice generator has completely transformed our billing process. It's intuitive, fast, and the templates look incredibly professional.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      content:
        "As a freelancer, keeping track of invoices was always a pain. This tool has saved me countless hours and helped me get paid faster.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      content:
        "The automated reminders and payment tracking features are game-changers. My cash flow has improved significantly since using this platform.",
      rating: 4,
    },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Invoice Generated",
      description: "Your invoice has been generated successfully.",
    })
  }

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon.",
    })
  }

  // Handle invoice download
  const handleDownloadInvoice = async () => {
    const success = await generateInvoicePDF(invoiceRef, formData.clientName)
    if (success) {
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded successfully.",
      })
    } else {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-lg border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">InvoiceAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
          </div>
          <MagneticButton>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              onClick={() => scrollToSection("contact")}
            >
              Get Started
            </Button>
          </MagneticButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl" />
        </motion.div>

        <div className="container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
                Create Professional Invoices in Seconds
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Streamline your billing process with our AI-powered invoice generator. Beautiful templates, automated
                reminders, and seamless payment tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <MagneticButton>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 h-auto"
                    onClick={() => scrollToSection("demo")}
                  >
                    Try it Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/5 backdrop-blur-lg hover:bg-white/10 text-white text-lg px-8 py-6 h-auto"
                    onClick={() => scrollToSection("features")}
                  >
                    See Features
                  </Button>
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div
              className="h-[400px] md:h-[500px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <PresentationControls
                    global
                    rotation={[0.13, 0.1, 0]}
                    polar={[-0.4, 0.2]}
                    azimuth={[-1, 0.75]}
                    damping={2}
                    snap={true}
                  >
                    <Float rotationIntensity={0.4}>
                      {/* Removed InvoiceModel component to fix missing import error */}
                    </Float>
                  </PresentationControls>
                  <Environment preset="city" />
                </Canvas>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <button
            onClick={() => scrollToSection("features")}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-sm">Scroll to explore</span>
            <ArrowRight className="w-5 h-5 animate-bounce" />
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to create, send, and track professional invoices
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-white" />}
              title="Beautiful Templates"
              description="Choose from dozens of professionally designed templates that make your invoices stand out."
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6 text-white" />}
              title="Multiple Payment Options"
              description="Accept payments via credit card, PayPal, bank transfer, and more with automatic reconciliation."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Client Management"
              description="Store client information securely and access it instantly when creating new invoices."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-white" />}
              title="Automated Reminders"
              description="Set up automatic payment reminders to reduce late payments and improve cash flow."
            />
            <FeatureCard
              icon={<Download className="w-6 h-6 text-white" />}
              title="Export & Download"
              description="Export invoices as PDF, CSV, or Excel files with a single click for your records."
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 text-white" />}
              title="Email Integration"
              description="Send professional invoices directly from the platform with customizable email templates."
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-black to-purple-950/20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Create professional invoices in just a few clicks</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">Client Name</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">Client Email</label>
                  <Input
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                    type="email"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">Invoice Amount</label>
                  <Input
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400">Due Date</label>
                  <Input
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>

                <MagneticButton>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Generate Invoice
                    <FileText className="w-4 h-4 ml-2" />
                  </Button>
                </MagneticButton>
              </form>
            </motion.div>

            <motion.div
              ref={invoiceRef}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(149,128,255,0.2)]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-1">INVOICE</h3>
                  <p className="text-gray-400">{formData.invoiceNumber}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Bill To:</p>
                  <p className="font-medium">{formData.clientName}</p>
                  <p className="text-gray-400">{formData.clientEmail}</p>
                  <p className="text-gray-400">{formData.clientAddress}</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-400">Invoice Date:</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-400">Due Date:</p>
                    <p>{formData.dueDate}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-400">Amount Due:</p>
                    <p className="font-bold">{formData.amount}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-3 gap-4 bg-white/10 p-3 rounded-lg mb-2">
                  <p className="font-medium col-span-2">Description</p>
                  <p className="font-medium text-right">Amount</p>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b border-white/10">
                    <p className="col-span-2">{item.description}</p>
                    <p className="text-right">{item.amount}</p>
                  </div>
                ))}

                <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                  <p className="font-bold">Total:</p>
                  <p className="font-bold">{formData.amount}</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                  onClick={handleDownloadInvoice}
                >
                  Download PDF
                  <Download className="w-4 h-4 ml-2" />
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Send Invoice
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Thousands of businesses trust our platform for their invoicing needs
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <TestimonialCard {...testimonials[activeTestimonial]} />
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? "bg-purple-500" : "bg-white/20"
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-black to-purple-950/20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Choose the plan that works best for your business</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="Free"
              description="Perfect for freelancers just getting started"
              features={[
                "Up to 5 invoices per month",
                "Basic invoice templates",
                "Email support",
                "PDF downloads",
                "Client management",
              ]}
            />

            <PricingCard
              title="Professional"
              price="$29"
              description="Ideal for growing businesses"
              features={[
                "Unlimited invoices",
                "Premium templates",
                "Automated reminders",
                "Multiple payment options",
                "Priority support",
                "Analytics dashboard",
              ]}
              highlighted={true}
            />

            <PricingCard
              title="Enterprise"
              price="$99"
              description="For established businesses with complex needs"
              features={[
                "Everything in Professional",
                "Custom branding",
                "Team accounts",
                "API access",
                "Dedicated account manager",
                "Advanced reporting",
                "Custom integrations",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions? We're here to help you get started
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <Input
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <Input
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                    placeholder="your@email.com"
                    type="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Message</label>
                  <Textarea
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500 min-h-[150px]"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <MagneticButton className="w-full">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </MagneticButton>
              </form>
            </motion.div>

            <motion.div
              className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10 h-fit"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6">FAQ</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">How secure is my data?</h4>
                  <p className="text-gray-400">
                    Your data is encrypted end-to-end and stored on secure servers. We follow industry best practices
                    for data protection.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Can I customize invoice templates?</h4>
                  <p className="text-gray-400">
                    Yes, all paid plans include the ability to customize templates with your logo, colors, and branding
                    elements.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Do you offer a free trial?</h4>
                  <p className="text-gray-400">
                    Yes, you can try our Professional plan free for 14 days, no credit card required.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">How do I get started?</h4>
                  <p className="text-gray-400">
                    Simply sign up for an account, choose your plan, and you can start creating invoices immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl">InvoiceAI</span>
              </div>
              <p className="text-gray-400 mb-4">The smart way to create, send, and track professional invoices.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} InvoiceAI. All rights Akhilesh reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
