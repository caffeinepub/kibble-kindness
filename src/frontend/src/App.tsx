import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Gift,
  Heart,
  Package,
  PawPrint,
  QrCode,
  RefreshCcw,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { label: "Meals Donated", value: "128,450", icon: Package },
  { label: "Pets Fed", value: "34,200", icon: PawPrint },
  { label: "Shelters Supported", value: "210", icon: Heart },
  { label: "Donors", value: "8,900+", icon: Users },
];

const STORIES = [
  {
    name: "Bruno",
    breed: "Labrador Mix",
    shelter: "Happy Tails Rescue, Mumbai",
    story:
      "Bruno arrived malnourished and scared. Thanks to generous kibble donations, he gained weight, found his spark, and was adopted within three weeks.",
    image: "/assets/generated/story-bruno.dim_400x300.jpg",
    color: "bg-amber-50",
  },
  {
    name: "Mittens",
    breed: "Street Cat",
    shelter: "Paws Unlimited, Delhi",
    story:
      "Mittens and her four kittens were found abandoned. Your food donations kept them healthy while we found loving homes for all five of them.",
    image: "/assets/generated/story-mittens.dim_400x300.jpg",
    color: "bg-orange-50",
  },
  {
    name: "Raja",
    breed: "Indian Pariah Dog",
    shelter: "Street Angels, Bengaluru",
    story:
      "Raja patrolled the streets hungry for years. Community food drives powered by Thali Bharo changed his life — now he sleeps warm and full every night.",
    image: "/assets/generated/story-raja.dim_400x300.jpg",
    color: "bg-yellow-50",
  },
];

const SHELTERS = [
  {
    name: "Happy Tails Rescue",
    city: "Mumbai",
    animals: 85,
    needs: "Dry Kibble, Wet Food",
  },
  {
    name: "Paws Unlimited",
    city: "Delhi",
    animals: 120,
    needs: "Kitten Formula, Wet Food",
  },
  {
    name: "Street Angels NGO",
    city: "Bengaluru",
    animals: 60,
    needs: "Dry Kibble, Treats",
  },
  {
    name: "Furever Home",
    city: "Chennai",
    animals: 95,
    needs: "Puppy Food, Senior Blend",
  },
  {
    name: "Wagging Tails",
    city: "Hyderabad",
    animals: 45,
    needs: "Mixed Kibble, Canned Food",
  },
  {
    name: "Stray Saviours",
    city: "Pune",
    animals: 70,
    needs: "Dry Kibble, Medical Diet",
  },
];

const FAQ = [
  {
    q: "How does my donation reach the pets?",
    a: "We partner directly with verified shelters and rescue groups. Your food donation is delivered to their door or they pick it up from our collection hubs within 48 hours.",
  },
  {
    q: "Can I donate online?",
    a: "Yes! Use our online donation form to contribute money. We purchase bulk food at wholesale prices, making every rupee go further.",
  },
  {
    q: "Which types of pet food are most needed?",
    a: "Dry kibble for dogs and cats is the highest priority as it stores well. Wet food, kitten formula, and senior blends are also gratefully received.",
  },
  {
    q: "Can I volunteer to deliver food?",
    a: "Absolutely! Fill in the volunteer form and our team will connect you with a nearby shelter that needs delivery support.",
  },
];

const PROCESSING_STEPS = [
  { label: "Verifying your details...", icon: "🔍" },
  { label: "Preparing your donation...", icon: "🎁" },
  { label: "Almost ready...", icon: "✨" },
];

type Section = "home" | "donate" | "shelters" | "stories";
type DonationStep = "form" | "processing" | "qr";

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [selectedShelter, setSelectedShelter] = useState("");
  const [donationStep, setDonationStep] = useState<DonationStep>("form");
  const [processingStep, setProcessingStep] = useState(0);
  const [submittedAmount, setSubmittedAmount] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || !donationAmount) return;

    setSubmittedAmount(donationAmount);
    setDonationStep("processing");
    setProcessingStep(0);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStep(i + 1);
    }
    await new Promise((r) => setTimeout(r, 400));
    setDonationStep("qr");
  };

  useEffect(() => {
    if (donationStep === "qr" && qrRef.current) {
      setTimeout(() => {
        qrRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [donationStep]);

  const handleReset = () => {
    setDonationStep("form");
    setProcessingStep(0);
    setDonorName("");
    setDonorEmail("");
    setDonationAmount("");
    setDonorMessage("");
    setSelectedShelter("");
    setSubmittedAmount("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => setActiveSection("home")}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/kibble-kindness-logo-transparent.dim_200x200.png"
              alt="Thali Bharo Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-xl font-bold text-primary">
              Thali Bharo
            </span>
          </button>
          <nav className="hidden sm:flex items-center gap-1">
            {(["home", "shelters", "stories", "donate"] as Section[]).map(
              (s) => (
                <button
                  type="button"
                  key={s}
                  data-ocid={`nav.${s}.link`}
                  onClick={() => setActiveSection(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeSection === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ),
            )}
          </nav>
          <Button
            data-ocid="nav.donate.primary_button"
            size="sm"
            onClick={() => setActiveSection("donate")}
            className="gap-2"
          >
            <Heart className="h-4 w-4" /> Donate
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero */}
              <section className="relative overflow-hidden">
                <div className="relative h-[520px] lg:h-[620px] w-full">
                  {[
                    {
                      src: "/assets/generated/hero-dog.dim_1200x600.jpg",
                      alt: "A happy dog ready to be fed",
                    },
                    {
                      src: "/assets/generated/hero-cat.dim_1200x600.jpg",
                      alt: "A cat eating from a bowl",
                    },
                    {
                      src: "/assets/generated/hero-community.dim_1200x600.jpg",
                      alt: "Community feeding animals",
                    },
                  ].map((img, i) => (
                    <img
                      key={img.src}
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                      style={{ opacity: heroSlide === i ? 1 : 0 }}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center">
                    <div className="max-w-xl">
                      <Badge className="mb-4 bg-primary/90 text-white border-0 hover:bg-primary">
                        🐾 Feeding Pets Across India
                      </Badge>
                      <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 drop-shadow-md">
                        Every Bowl <br />
                        <span className="text-amber-300">Filled with Love</span>
                      </h1>
                      <p className="text-lg text-white/85 mb-8 leading-relaxed drop-shadow">
                        Thali Bharo connects generous donors with shelters and
                        rescue animals across India. One small bag of food can
                        change a pet's entire world.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button
                          data-ocid="hero.donate.primary_button"
                          size="lg"
                          onClick={() => setActiveSection("donate")}
                          className="gap-2 shadow-warm bg-primary hover:bg-primary/90"
                        >
                          <Heart className="h-5 w-5" /> Donate Food Now
                        </Button>
                        <Button
                          data-ocid="hero.shelters.secondary_button"
                          variant="outline"
                          size="lg"
                          onClick={() => setActiveSection("shelters")}
                          className="gap-2 bg-white/10 border-white/60 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                        >
                          <PawPrint className="h-5 w-5" /> See Shelters
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Slide indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {[0, 1, 2].map((i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setHeroSlide(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${heroSlide === i ? "bg-white scale-125" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Stats */}
              <section className="py-16 px-4 bg-card">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="text-center border-border hover:shadow-warm transition-shadow">
                          <CardContent className="pt-6">
                            <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                            <p className="font-display text-3xl font-bold text-foreground">
                              {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {stat.label}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* How It Works */}
              <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="font-display text-4xl font-bold mb-4">
                    How It Works
                  </h2>
                  <p className="text-muted-foreground mb-12 text-lg">
                    Simple steps to make a real difference
                  </p>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        step: "1",
                        icon: Gift,
                        title: "Choose & Donate",
                        desc: "Pick an amount or a shelter, then donate online in minutes.",
                      },
                      {
                        step: "2",
                        icon: Package,
                        title: "We Source the Food",
                        desc: "We buy quality pet food in bulk and pack it for delivery.",
                      },
                      {
                        step: "3",
                        icon: PawPrint,
                        title: "Pets Get Fed",
                        desc: "Shelters receive the food and happy pets eat a warm meal.",
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex flex-col items-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <item.icon className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                          Step {item.step}
                        </span>
                        <h3 className="font-display text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Stories teaser */}
              <section className="py-16 px-4 bg-accent/40">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="font-display text-4xl font-bold">
                        Stories of Hope
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        Pets whose lives you helped change
                      </p>
                    </div>
                    <Button
                      data-ocid="home.stories.secondary_button"
                      variant="outline"
                      onClick={() => setActiveSection("stories")}
                      className="gap-2 hidden sm:flex"
                    >
                      All Stories <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {STORIES.map((story, i) => (
                      <motion.div
                        key={story.name}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card
                          className={`${story.color} border-0 shadow-xs hover:shadow-warm transition-shadow overflow-hidden`}
                        >
                          <div className="overflow-hidden">
                            <img
                              src={story.image}
                              alt={story.name}
                              className="object-cover h-48 w-full rounded-t-xl"
                            />
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="font-display">
                              {story.name}
                            </CardTitle>
                            <CardDescription>
                              {story.breed} · {story.shelter}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {story.story}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="font-display text-4xl font-bold text-center mb-10">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3" data-ocid="faq.list">
                    {FAQ.map((item, i) => (
                      <div
                        key={item.q}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <button
                          type="button"
                          data-ocid={`faq.item.${i + 1}`}
                          className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-accent/50 transition-colors"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                          {item.q}
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                              openFaq === i ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA Banner */}
              <section className="py-20 px-4 bg-primary text-primary-foreground">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="font-display text-4xl font-bold mb-4">
                    A Hungry Pet Can't Wait
                  </h2>
                  <p className="text-primary-foreground/80 text-lg mb-8">
                    Your donation today means a full bowl tomorrow. Every rupee
                    counts.
                  </p>
                  <Button
                    data-ocid="cta.donate.primary_button"
                    size="lg"
                    variant="secondary"
                    onClick={() => setActiveSection("donate")}
                    className="gap-2 font-semibold"
                  >
                    <Heart className="h-5 w-5" /> Donate Now
                  </Button>
                </div>
              </section>
            </motion.div>
          )}

          {activeSection === "donate" && (
            <motion.div
              key="donate"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="py-16 px-4"
            >
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <h1 className="font-display text-4xl font-bold mb-3">
                    Make a Donation
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Your kindness fills bowls for many pets, one meal at a time.
                  </p>
                </div>

                <Card className="shadow-warm relative overflow-hidden">
                  <CardContent className="p-8">
                    {/* Processing overlay */}
                    <AnimatePresence>
                      {donationStep === "processing" && (
                        <motion.div
                          key="processing-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl gap-6"
                          data-ocid="donation.loading_state"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
                          />
                          <div className="space-y-3 text-center">
                            {PROCESSING_STEPS.map((step, i) => (
                              <motion.div
                                key={step.label}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{
                                  opacity:
                                    processingStep > i
                                      ? 1
                                      : processingStep === i
                                        ? 0.5
                                        : 0.2,
                                  x: 0,
                                }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 justify-center"
                              >
                                {processingStep > i ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <span className="text-lg flex-shrink-0">
                                    {step.icon}
                                  </span>
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    processingStep > i
                                      ? "text-green-600 line-through"
                                      : processingStep === i
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form
                      onSubmit={handleDonate}
                      className="space-y-6"
                      data-ocid="donation.form"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="donorName">Your Name *</Label>
                          <Input
                            id="donorName"
                            data-ocid="donation.name.input"
                            placeholder="Aarav Kumar"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            disabled={donationStep !== "form"}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="donorEmail">Email Address *</Label>
                          <Input
                            id="donorEmail"
                            type="email"
                            data-ocid="donation.email.input"
                            placeholder="aarav@example.com"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            disabled={donationStep !== "form"}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Donation Amount (₹) *</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {["100", "250", "500", "1000", "2500"].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              data-ocid="donation.amount.toggle"
                              onClick={() =>
                                donationStep === "form" &&
                                setDonationAmount(amt)
                              }
                              disabled={donationStep !== "form"}
                              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                donationAmount === amt
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border hover:border-primary hover:bg-accent"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              ₹{amt}
                            </button>
                          ))}
                        </div>
                        <Input
                          data-ocid="donation.amount.input"
                          type="number"
                          placeholder="Or enter custom amount"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          disabled={donationStep !== "form"}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Shelter Preference</Label>
                        <Select
                          value={selectedShelter}
                          onValueChange={setSelectedShelter}
                          disabled={donationStep !== "form"}
                        >
                          <SelectTrigger data-ocid="donation.shelter.select">
                            <SelectValue placeholder="Any shelter (we'll allocate where needed)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">
                              Any shelter (we'll allocate where needed)
                            </SelectItem>
                            {SHELTERS.map((s) => (
                              <SelectItem key={s.name} value={s.name}>
                                {s.name} — {s.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donorMessage">Message (optional)</Label>
                        <Textarea
                          id="donorMessage"
                          data-ocid="donation.message.textarea"
                          placeholder="A note of encouragement for the shelter team..."
                          value={donorMessage}
                          onChange={(e) => setDonorMessage(e.target.value)}
                          disabled={donationStep !== "form"}
                          rows={3}
                        />
                      </div>

                      {donationStep === "form" && (
                        <Button
                          type="submit"
                          data-ocid="donation.submit.primary_button"
                          size="lg"
                          className="w-full gap-2"
                          disabled={
                            !donorName || !donorEmail || !donationAmount
                          }
                        >
                          <Heart className="h-5 w-5" /> Donate with Kindness
                        </Button>
                      )}

                      {donationStep === "qr" && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <p className="text-sm text-green-700 font-medium">
                            Details confirmed! Scan the QR below to complete
                            your payment.
                          </p>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-primary" /> 4.9 star rated
                    charity
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>100% goes to pet food</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Instant confirmation</span>
                </div>

                {/* PhonePe QR Payment Section */}
                <div className="mt-10" ref={qrRef}>
                  <div className="relative flex items-center gap-4 my-6">
                    <Separator className="flex-1" />
                    <span className="text-sm text-muted-foreground font-medium px-2">
                      {donationStep === "qr"
                        ? "SCAN TO COMPLETE PAYMENT"
                        : "OR PAY DIRECTLY"}
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <AnimatePresence mode="wait">
                    {donationStep === "qr" ? (
                      <motion.div
                        key="qr-highlighted"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          bounce: 0.3,
                        }}
                      >
                        {/* Attention banner */}
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mb-4 flex items-center justify-center gap-2 p-3 bg-amber-50 border border-amber-300 rounded-xl"
                          data-ocid="qr.success_state"
                        >
                          <span className="text-xl">🎉</span>
                          <p className="font-semibold text-amber-800 text-center">
                            Scan &amp; Pay to Complete Your Donation of ₹
                            {submittedAmount}
                          </p>
                        </motion.div>

                        <Card
                          className="border-4 border-primary shadow-[0_0_32px_rgba(var(--primary-rgb),0.35)] bg-gradient-to-b from-purple-50/80 to-white relative overflow-hidden"
                          data-ocid="phonepe.panel"
                          style={{
                            animation: "qr-pulse 2s ease-in-out infinite",
                          }}
                        >
                          {/* Pulsing ring */}
                          <div
                            className="absolute inset-0 rounded-xl border-4 border-primary/40 animate-ping pointer-events-none"
                            style={{ animationDuration: "2s" }}
                          />

                          <CardHeader className="text-center pb-2">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center">
                                <Smartphone className="h-4 w-4 text-white" />
                              </div>
                              <CardTitle className="font-display text-xl text-[#5f259f]">
                                PhonePe
                              </CardTitle>
                            </div>
                            <CardDescription className="text-sm font-medium">
                              Scan &amp; Pay Using PhonePe App
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center gap-4 pb-8">
                            <motion.div
                              animate={{
                                boxShadow: [
                                  "0 0 0px rgba(239,68,68,0.4)",
                                  "0 0 24px rgba(239,68,68,0.7)",
                                  "0 0 0px rgba(239,68,68,0.4)",
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                              className="relative rounded-full"
                            >
                              <img
                                src="/assets/uploads/satyam_qr-019d2e67-fed3-749c-aff6-2a34a1a0e216-1.jpg"
                                alt="PhonePe QR Code — Satyam Kumar"
                                data-ocid="phonepe.canvas_target"
                                className="w-96 h-96 object-contain shadow-xl bg-white p-2 rounded-xl"
                              />
                            </motion.div>
                            <div className="text-center space-y-1">
                              <div className="flex items-center justify-center gap-2">
                                <QrCode className="h-4 w-4 text-[#5f259f]" />
                                <p className="font-semibold text-foreground">
                                  Satyam Kumar
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Open PhonePe → Scan QR → Enter ₹
                                {submittedAmount} → Pay
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs mt-2"
                              >
                                🔒 Secure UPI Payment
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="mt-6 text-center">
                          <Button
                            data-ocid="donation.reset.secondary_button"
                            variant="outline"
                            onClick={handleReset}
                            className="gap-2"
                          >
                            <RefreshCcw className="h-4 w-4" /> Start New
                            Donation
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="qr-default"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card
                          className="border-2 border-primary/20 bg-gradient-to-b from-purple-50/60 to-white shadow-warm"
                          data-ocid="phonepe.panel"
                        >
                          <CardHeader className="text-center pb-2">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center">
                                <Smartphone className="h-4 w-4 text-white" />
                              </div>
                              <CardTitle className="font-display text-xl text-[#5f259f]">
                                PhonePe
                              </CardTitle>
                            </div>
                            <CardDescription className="text-sm font-medium">
                              Scan &amp; Pay Using PhonePe App
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center gap-4 pb-8">
                            <div className="relative">
                              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#5f259f]/30 to-primary/20 blur-sm" />
                              <img
                                src="/assets/uploads/satyam_qr-019d2e67-fed3-749c-aff6-2a34a1a0e216-1.jpg"
                                alt="PhonePe QR Code — Satyam Kumar"
                                data-ocid="phonepe.canvas_target"
                                className="relative w-96 h-96 object-contain shadow-xl bg-white p-2 rounded-xl"
                              />
                            </div>
                            <div className="text-center space-y-1">
                              <div className="flex items-center justify-center gap-2">
                                <QrCode className="h-4 w-4 text-[#5f259f]" />
                                <p className="font-semibold text-foreground">
                                  Satyam Kumar
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Open PhonePe → Scan QR → Enter amount → Pay
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs mt-2"
                              >
                                🔒 Secure UPI Payment
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "shelters" && (
            <motion.div
              key="shelters"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="py-16 px-4"
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="font-display text-4xl font-bold mb-3">
                    Partner Shelters
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    These shelters are waiting for your generosity right now.
                  </p>
                </div>
                <div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  data-ocid="shelters.list"
                >
                  {SHELTERS.map((shelter, i) => (
                    <motion.div
                      key={shelter.name}
                      data-ocid={`shelters.item.${i + 1}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Card className="h-full hover:shadow-warm transition-shadow border-border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="font-display text-lg">
                                {shelter.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {shelter.city}
                              </CardDescription>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-xs shrink-0"
                            >
                              {shelter.animals} animals
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Current Needs
                            </p>
                            <p className="text-sm font-medium">
                              {shelter.needs}
                            </p>
                          </div>
                          <Button
                            data-ocid={`shelters.donate.button.${i + 1}`}
                            size="sm"
                            className="w-full gap-2"
                            onClick={() => {
                              setSelectedShelter(shelter.name);
                              setActiveSection("donate");
                            }}
                          >
                            <Heart className="h-4 w-4" /> Donate to{" "}
                            {shelter.name.split(" ")[0]}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "stories" && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="py-16 px-4"
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="font-display text-4xl font-bold mb-3">
                    Stories of Hope
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Real pets whose lives you helped change.
                  </p>
                </div>
                <div
                  className="grid md:grid-cols-3 gap-8"
                  data-ocid="stories.list"
                >
                  {STORIES.map((story, i) => (
                    <motion.div
                      key={story.name}
                      data-ocid={`stories.item.${i + 1}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12 }}
                    >
                      <Card
                        className={`${story.color} border-0 shadow-xs hover:shadow-warm transition-shadow h-full overflow-hidden`}
                      >
                        <div className="overflow-hidden">
                          <img
                            src={story.image}
                            alt={story.name}
                            className="object-cover h-48 w-full rounded-t-xl"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="font-display text-2xl">
                            {story.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {story.breed}
                          </CardDescription>
                          <Badge
                            variant="outline"
                            className="w-fit text-xs mt-1"
                          >
                            {story.shelter}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {story.story}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button
                    data-ocid="stories.donate.primary_button"
                    size="lg"
                    onClick={() => setActiveSection("donate")}
                    className="gap-2"
                  >
                    <Heart className="h-5 w-5" /> Help Write the Next Story
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/kibble-kindness-logo-transparent.dim_200x200.png"
                alt="Thali Bharo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-xl font-bold text-primary">
                Thali Bharo
              </span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <button
                type="button"
                data-ocid="footer.home.link"
                onClick={() => setActiveSection("home")}
                className="hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                data-ocid="footer.shelters.link"
                onClick={() => setActiveSection("shelters")}
                className="hover:text-foreground transition-colors"
              >
                Shelters
              </button>
              <button
                type="button"
                data-ocid="footer.stories.link"
                onClick={() => setActiveSection("stories")}
                className="hover:text-foreground transition-colors"
              >
                Stories
              </button>
              <button
                type="button"
                data-ocid="footer.donate.link"
                onClick={() => setActiveSection("donate")}
                className="hover:text-foreground transition-colors"
              >
                Donate
              </button>
            </nav>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Thali Bharo. Built with{" "}
              <Heart className="inline h-3 w-3 text-primary" /> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
