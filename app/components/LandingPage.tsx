import Link from "next/link";
import { Menu, X, Globe, BookOpen, Clock, Target } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">Mwalimu Tools</div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-blue-600">
                <Globe size={18} />
                <span className="font-medium">Other Countries</span>
              </button>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Globe size={20} />
              </button>
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <BookOpen size={20} />
              </button>
              <Link
                href="/signin"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-600">
                About Us
              </Link>
              <Link href="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200 mt-4 flex gap-2">
                <Link
                  href="/signin"
                  className="flex-1 px-4 py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  className="flex-1 px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Trust Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 text-center">
        <p className="text-sm font-medium text-gray-700">
          ✓ Trusted by 30,000+ Rwandan teachers
        </p>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg m-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Need help? Contact <span className="text-blue-600 underline">Kwizera Abel: 0785969446</span>
              </p>
            </div>
          </div>
          <Link
            href="https://wa.me/250785969446"
            className="px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 whitespace-nowrap"
          >
            Join WhatsApp Support
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-600 text-sm font-medium mb-4">
              🇷🇼 AI-Powered REB-Compliant Lesson Planning for Rwanda Schools
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Generated REB Lesson Plans for Rwanda Schools
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AI automatically generates professional lesson plans aligned with Rwanda Education Board curriculum. Perfect for Competency-Based Curriculum (CBC), RTB session plans, and Nursery education. AI creates complete, standards-compliant lesson plans from your basic information.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">AI-Generated REB, RTB & Nursery Formats</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">AI Ensures Rwanda Education Board Compliance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">AI-Aligned CBC Curriculum Content</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">AI-Generated, Editable PDF Format</p>
                </div>
              </div>
            </div>

            <Link
              href="/get-started"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Generate AI Lesson Plans →
            </Link>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-6 shadow-lg">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-gray-500 text-sm font-mono mb-2">LESSON PLAN</div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-5/6" />
                  <div className="h-2 bg-red-200 rounded w-2/3 mt-4" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            AI-Powered Professional Lesson Planning for Rwanda Teachers
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Generate REB-compliant lesson plans with AI-powered content creation, following Rwanda Education Board, RTB, and Nursery standard formats.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* REB Lesson Plan Card */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">REB Lesson Plan Format</h3>
              <p className="text-gray-600 mb-6">
                AI-generated Rwanda Education Board (REB) lesson plan format for primary and secondary schools, following the Competency-Based Curriculum (CBC). Creates complete lesson plans for mathematics, English, Kinyarwanda, science, and social studies from your basic information.
              </p>
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI-generated CBC competency-based content</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI-created cross-cutting issues</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI-created REB assessment strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI-aligned generic competencies development</span>
                </div>
              </div>
              <Link
                href="/reb-lesson-plan"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Generate AI REB Lesson Plan →
              </Link>
            </div>

            {/* RTB Session Plan Card */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">RTB Session Plan Format</h3>
              <p className="text-gray-600 mb-6">
                AI-generated Rwanda TVET Board (RTB) session plan format for technical and vocational training. Our AI creates complete, industry-standard session plans from your basic training information.
              </p>
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Practical training approach</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Step-by-step activities</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Assessment and reflection</span>
                </div>
              </div>
              <Link
                href="/rtb-session-plan"
                className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Generate AI RTB Session Plan →
              </Link>
            </div>

            {/* Nursery Lesson Plan Card */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nursery Lesson Plan Format</h3>
              <p className="text-gray-600 mb-6">
                AI-generated lesson plans specifically designed for nursery and early childhood education. AI creates age-appropriate, play-based learning activities for young learners.
              </p>
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Age-appropriate activities</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Play-based learning approach</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Early childhood development focus</span>
                </div>
              </div>
              <Link
                href="/nursery-lesson-plan"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Generate AI Nursery Lesson Plan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Create comprehensive lesson plans in three simple steps.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Input Basic Details</h3>
              <p className="text-gray-600">
                Enter your lesson title, class level, subject, and other key information aligned with the Rwandan curriculum.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Plan</h3>
              <p className="text-gray-600">
                Our system creates a structured lesson plan based on your inputs, following REB competency guidelines.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Download & Use</h3>
              <p className="text-gray-600">
                Download your lesson plan in PDF format, ready for classroom use and inspection by school administration.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/get-started"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Generate Your First AI Lesson Plan →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Perfect for Rwanda Teachers
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Whether you're looking for lesson plan templates, REB format examples, or CBC curriculum guides, our platform has everything you need.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">REB Lesson Plan Format</h3>
              <p className="text-gray-600 text-sm">
                Get the exact REB lesson plan format with proper structure, competency-based curriculum alignment, and cross-cutting issues integration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">CBC Lesson Plan Template</h3>
              <p className="text-gray-600 text-sm">
                Ready-to-use CBC lesson plan templates for mathematics, English, Kinyarwanda, science, and social studies subjects.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Primary School Lesson Plans</h3>
              <p className="text-gray-600 text-sm">
                Specialized lesson plans for primary school levels (P1-P6) following Rwanda Education Board guidelines and assessment strategies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Secondary School Lesson Plans</h3>
              <p className="text-gray-600 text-sm">
                Complete lesson plans for secondary school levels (S1-S6) with proper learning objectives and generic competences development.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Teacher Training Resources</h3>
              <p className="text-gray-600 text-sm">
                Professional development resources for lesson planning skills, CBC implementation, and REB curriculum understanding.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">RTB Session Plans</h3>
              <p className="text-gray-600 text-sm">
                Professional RTB session plan format for technical and vocational training with step-by-step activities and practical assessments.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                lesson plan format Rwanda
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                REB lesson plan example
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                CBC lesson plan template
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                how to write lesson plan REB
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual Support Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Multilingual Support
          </h2>
          <p className="text-center text-gray-600 mb-16">
            Create lesson plans in your preferred language with our multilingual platform.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-blue-50 rounded-lg p-8">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">EN</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">English</h3>
              <p className="text-gray-600">Complete platform support in English</p>
            </div>

            <div className="text-center bg-purple-50 rounded-lg p-8">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">FR</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Français</h3>
              <p className="text-gray-600">Interface complète en français</p>
            </div>

            <div className="text-center bg-green-50 rounded-lg p-8">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">RW</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kinyarwanda</h3>
              <p className="text-gray-600">Porogiramu yose mu Kinyarwanda</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">Easily switch between languages with our language selector</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Teaching in Rwanda?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join teachers across Rwanda who save time and create better learning experiences with our specialized tools.
          </p>
          <Link
            href="/get-started"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Mwalimu Tools</h3>
              <p className="text-sm">
                Empowering educators with innovative tools to streamline lesson planning and create exceptional learning experiences.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Additional</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/sitemap" className="hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Mwalimu Tools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
