import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import WelcomeSection from "../components/WelcomeSection";
import Sponsors from "../components/Sponsors";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import FAQFirebase from "../components/FAQFirebase";
import ContactFirebase from "../components/ContactFirebase";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <WelcomeSection />
      <About />
      <Sponsors />
      <Gallery />
      <Reviews />
      <FAQFirebase />
      <ContactFirebase />
      <Footer />
    </div>
  );
}

export default HomePage;
